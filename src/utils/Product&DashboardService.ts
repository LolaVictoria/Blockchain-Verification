import apiClient from './apiClient';
import cacheManager from './CacheManager';
import type { Product } from '../../types/dashboard';

// Product Service - handles product registration and management
export class ProductService {
  private static instance: ProductService;

  private constructor() {}

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  // Product registration function (from main.js handleProductRegistration)
  async registerProduct(productData: {
    serial_number: string;
    name: string;
    category: string;
    description?: string;
    price: number;
  }): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      // Validate user verification status
      const userString = localStorage.getItem('user');
      let user;
      try {
        user = userString ? JSON.parse(userString) : null;
      } catch (error) {
        console.error('Error parsing user data:', error);
        throw new Error('Invalid user data. Please log in again.');
      }

      // Check verification status
      if (!user || user.verification_status !== 'verified') {
        throw new Error('Your account needs admin verification before you can register products.');
      }

      // Validate form data
      if (!productData.serial_number || !productData.name || !productData.category || isNaN(productData.price)) {
        throw new Error('Please fill in all required fields (serial number, name, category, price).');
      }

      // Clean the data
      const cleanProductData = {
        serial_number: productData.serial_number.trim(),
        name: productData.name.trim(),
        category: productData.category.trim(),
        description: productData.description?.trim() || '',
        price: productData.price
      };

      const response = await apiClient.post('/manufacturer/register-product', cleanProductData);

      if (response.status === 200 || response.status === 201) {
        // Clear relevant caches after successful registration
        cacheManager.smartCacheClear('product_registration');
        
        return {
          success: true,
          message: response.data.message || 'Product registered successfully on blockchain!',
          data: response.data
        };
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Product registration error:', error);
      const errorMessage = error.message || error.data?.error || 'Registration failed';
      
      if (error.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      
      throw new Error(errorMessage);
    }
  }

  // Manual verification function (from main.js handleManualVerification)
  async verifyProduct(serialNumber: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      if (!serialNumber || !serialNumber.trim()) {
        throw new Error('Please enter a serial number');
      }

      const response = await apiClient.post('/verify-product', {
        serial_number: serialNumber.trim()
      });

      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: 'Product verification completed'
        };
      } else {
        throw new Error(response.data.error || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Product verification error:', error);
      throw new Error(error.message || error.data?.error || 'Verification failed');
    }
  }

  // Get products for manufacturer
  async getManufacturerProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<{ status: string; products: Product[] }>('/manufacturer/products');
      
      if (response.status === 200 && response.data.status === 'success') {
        return response.data.products || [];
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching manufacturer products:', error);
      if (error.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return [];
    }
  }

  // Create product card HTML (from main.js createProductCard)
  createProductCard(product: Product): string {
    return `
      <div class="product-card">
        <div class="product-image">
          ${product.verified ? '<div class="blockchain-badge">🔗 Blockchain</div>' : ''}
        </div>
        <div class="product-info">
          <h3>${product.product_name}</h3>
          <div class="product-details">
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Serial:</strong> ${product.serial_number}</p>
            <p><strong>Status:</strong> ${product.verified ? 'Verified' : 'Pending'}</p>
            ${product.transaction_hash ? `<p><strong>TX Hash:</strong> ${product.transaction_hash.substring(0, 20)}...</p>` : ''}
          </div>
          <button class="verify-btn" onclick="verifyProduct('${product.serial_number}')">
            ${product.verified ? 'Verify on Blockchain' : 'Verify Authenticity'}
          </button>
          <div id="verification-${product.serial_number}" class="verification-result"></div>
        </div>
      </div>
    `;
  }
}

// Dashboard Service - handles dashboard functionality
export class DashboardService {
  private static instance: DashboardService;

  private constructor() {}

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  // Initialize dashboard (from main.js initializeDashboard)
  initializeDashboard(): boolean {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');
    
    if (!token) {
      window.location.href = '/login';
      return false;
    }

    try {
      const user = userString ? JSON.parse(userString) : null;
      if (!user || user.role !== 'manufacturer') {
        window.location.href = '/';
        return false;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      window.location.href = '/login';
      return false;
    }
    
    this.loadDashboard();
    return true;
  }

  // Load dashboard data (from main.js loadDashboard)
  async loadDashboard(forceRefresh = false): Promise<void> {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token, redirecting to login');
      window.location.href = '/login';
      return;
    }

    try {
      await cacheManager.loadMultipleDataWithCache({
        products: { displayFunction: this.displayManufacturerProducts },
        stats: { displayFunction: this.updateDashboardStats }
      }, forceRefresh);
    } catch (error) {
      console.error('Dashboard loading error:', error);
    }
  }

  // Update dashboard stats (from main.js updateDashboardStats)
  updateDashboardStats = (stats: any): void => {
    const statsContainer = document.getElementById('dashboard-stats');
    if (!statsContainer) return;

    const totalProducts = stats.total_products ?? 0;
    const blockchainVerified = stats.blockchain_verified ?? 0;
    const totalValue = stats.total_value ?? 0;
    const categoriesCount = stats.categories ? Object.keys(stats.categories).length : 0;

    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-number">${totalProducts}</div>
        <div class="stat-label">Total Products</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${blockchainVerified}</div>
        <div class="stat-label">Blockchain Verified</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${totalValue.toLocaleString()}</div>
        <div class="stat-label">Total Value</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${categoriesCount}</div>
        <div class="stat-label">Categories</div>
      </div>
    `;
  };

  // Display manufacturer products (from main.js displayManufacturerProducts)
  displayManufacturerProducts = (products: Product[]): void => {
    const container = document.getElementById('manufacturer-products');
    if (!container) return;
    
    if (products.length === 0) {
      container.innerHTML = '<p class="text-center">No products registered yet. Register your first product below!</p>';
      return;
    }
    
    container.innerHTML = products.map(product => `
      <div class="product-card">
        <div class="product-image">
          ${product.verified ? '<div class="blockchain-badge">🔗 Blockchain</div>' : ''}
        </div>
        <div class="product-info">
          <h3>${product.product_name}</h3>
          <div class="product-details">
            <p><strong>Serial:</strong> ${product.serial_number}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Status:</strong> ${product.verified ? 'Verified' : 'Pending'}</p>
            ${product.transaction_hash ? `<p><strong>TX Hash:</strong> ${product.transaction_hash.substring(0, 20)}...</p>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  };

  // Get dashboard stats
  async getDashboardStats(): Promise<any> {
    try {
      const response = await apiClient.get<{ status: string; stats: any }>('/manufacturer/dashboard-stats');
      
      if (response.status === 200 && response.data.status === 'success') {
        return response.data.stats;
      }
      return {};
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      if (error.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return {};
    }
  }
}

// Utility Service - handles utility functions from main.js
export class UtilityService {
  private static instance: UtilityService;

  private constructor() {}

  static getInstance(): UtilityService {
    if (!UtilityService.instance) {
      UtilityService.instance = new UtilityService();
    }
    return UtilityService.instance;
  }

  // Show alert function (from main.js showAlert)
  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert at top of main content
    const main = document.querySelector('main') || document.body;
    main.insertBefore(alert, main.firstChild);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 30000);
  }

  // Generate random serial number (from main.js generateSerialNumber)
  generateSerialNumber(): string {
    const prefix = 'TEST';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Format wallet address (from main.js formatWalletAddress)
  formatWalletAddress(address: string): string {
    if (!address) return 'No wallet';
    if (address.length > 20) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    return address;
  }

  // Validate Ethereum address (from main.js isValidEthereumAddress)
  isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Initialize navigation (from main.js initializeNavigation)
  initializeNavigation(): void {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
      });
    }
  }

  // Update UI for authentication (from main.js updateUIForAuthentication)
  updateUIForAuthentication(user: any): void {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && user) {
      // Update navigation for logged-in users
      navMenu.innerHTML = `
        <a href="/" class="nav-link">Home</a>
        <a href="/verify" class="nav-link">Verify Product</a>
        ${user.role === 'manufacturer' ? '<a href="/dashboard" class="nav-link">Dashboard</a>' : ''}
        <a href="#" class="nav-link" onclick="logout()">Logout</a>
      `;
    }
  }

  // Handle profile loading errors (from main.js handleProfileError)
  handleProfileError(): void {
    const userEmail = document.getElementById('user-email');
    const companyName = document.getElementById('company-name');
    const walletAddress = document.getElementById('wallet-address');
    const verificationStatus = document.getElementById('verification-status');

    if (userEmail) userEmail.textContent = 'Error loading profile';
    if (companyName) companyName.textContent = 'Please refresh';
    if (walletAddress) walletAddress.textContent = '';
    if (verificationStatus) verificationStatus.textContent = '';
  }

  // Handle unauthenticated users (from main.js handleUnauthenticatedUser)
  handleUnauthenticatedUser(): void {
    const userEmail = document.getElementById('user-email');
    const companyName = document.getElementById('company-name');
    const walletAddress = document.getElementById('wallet-address');
    const verificationStatus = document.getElementById('verification-status');

    if (userEmail) userEmail.textContent = 'Not logged in';
    if (companyName) companyName.textContent = 'Please log in';
    if (walletAddress) walletAddress.textContent = '';
    if (verificationStatus) verificationStatus.textContent = '';
  }

  // Update profile UI (from main.js updateProfileUI)
  async updateProfileUI(user: any): Promise<void> {
    // Update profile letter
    if (!user) {
      const navUser = document.querySelector('.nav-user');
      if (navUser) (navUser as HTMLElement).style.display = "none";
      return;
    }
    
    const profileLetter = document.getElementById('profile-letter');
    if (profileLetter) {
      const name = user.name || user.primary_email;
      profileLetter.textContent = name.charAt(0).toUpperCase();
    }
    
    const userEmail = document.getElementById('user-email');
    if (userEmail) userEmail.textContent = user.primary_email || 'No email';
    
    // Handle role-specific data
    if (user.role === 'manufacturer') {
      const companyName = document.getElementById('company-name');
      if (companyName) companyName.textContent = user.current_company_name || 'No company';
      
      const walletAddress = document.getElementById('wallet-address');
      if (walletAddress) walletAddress.textContent = 
        user.primary_wallet ? this.formatWalletAddress(user.primary_wallet) : 'No wallet';
      
      // Update verification status
      const statusElement = document.getElementById('verification-status');
      if (statusElement) {
        const verificationStatus = user.verification_status || 'pending';
        statusElement.textContent = verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1);
        statusElement.className = `verification-status ${verificationStatus}`;
        statusElement.textContent = user.verification_status === 'verified' ? 'Verified' : 'Pending';
        statusElement.style.color = user.verification_status === 'verified' ? '#10b981' : '#f59e0b';
        statusElement.style.backgroundColor = user.verification_status === 'verified' ? '#f0fdf4' : '#fefcbf';
        statusElement.style.padding = '0.25rem 0.5rem'; 
        statusElement.style.borderRadius = '0.25rem'; 
        statusElement.style.fontSize = '0.875rem'; 
      }
    } else if (user.role === 'customer') {
      const companyName = document.getElementById('company-name');
      if (companyName) companyName.textContent = user.full_name || user.name || 'Customer';
      
      const walletAddress = document.getElementById('wallet-address');
      if (walletAddress) walletAddress.textContent = 
        user.wallet_address ? this.formatWalletAddress(user.wallet_address) : 'No wallet';
      
      // Update customer status
      const statusElement = document.getElementById('verification-status');
      if (statusElement) {
        statusElement.textContent = 'Customer';
        statusElement.className = 'verification-status verified';
      }
    }
  }

  // Toggle dropdown (from main.js toggleDropdown)
  toggleDropdown(): void {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  // Close verification overlay (referenced in main.js)
  closeVerificationOverlay(): void {
    const overlay = document.querySelector('.verification-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
}

// Create singleton instances
export const productService = ProductService.getInstance();
export const dashboardService = DashboardService.getInstance();
export const utilityService = UtilityService.getInstance();

// Export individual functions for easier migration from main.js
export const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info') => 
  utilityService.showAlert(message, type);
export const generateSerialNumber = () => utilityService.generateSerialNumber();
export const formatWalletAddress = (address: string) => utilityService.formatWalletAddress(address);
export const isValidEthereumAddress = (address: string) => utilityService.isValidEthereumAddress(address);
export const initializeNavigation = () => utilityService.initializeNavigation();
export const updateUIForAuthentication = (user: any) => utilityService.updateUIForAuthentication(user);
export const handleProfileError = () => utilityService.handleProfileError();
export const handleUnauthenticatedUser = () => utilityService.handleUnauthenticatedUser();
export const updateProfileUI = (user: any) => utilityService.updateProfileUI(user);
export const toggleDropdown = () => utilityService.toggleDropdown();
export const closeVerificationOverlay = () => utilityService.closeVerificationOverlay();