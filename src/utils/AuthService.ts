import apiClient from './apiClient';
import type {
  User,
  LoginResponse,
  SignupResponse,
  ProfileResponse,
  EmailVerificationResponse,
  TokenPayload,
  // VerificationStatus
} from '../../types/auth';

export class AuthService {
  private static instance: AuthService;

  // App state equivalent to your vanilla JS AppState
  public appState = {
    user: null as User | null,
    isAuthenticated: false,
    products: [] as any[],
    currentPage: 'home'
  };

  private constructor() { }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Equivalent to checkAuthStatus() from main.js
  checkAuthStatus(): boolean {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
        const now = Date.now() / 1000;

        if (payload.exp > now) {
          this.appState.isAuthenticated = true;
          this.appState.user = {
            id: payload.user_id,
            username: payload.username,
            email: payload.identity,
            role: payload.role,
            is_auth_verified: payload.is_verified,
            is_admin: payload.is_admin,
            is_active: true,
            auth_verification_status: payload.is_verified,
            wallet_verification_status: payload.verification_status,
            current_company_name: payload.current_company_name,
            primary_wallet: payload.primary_wallet,
  
  // Add missing required fields with default values or from payload
          created_at: payload.created_at || '',
          updated_at: payload.updated_at || '',
          verification_status: payload.verification_status || 'pending',
          company_names: payload.company_names || [],
          emails: payload.emails || [],
          primary_email: payload.primary_email || payload.identity,
          verified_wallets: payload.verified_wallets || [],
          wallet_addresses: payload.wallet_addresses || []
};
          return true;
        } else {
          this.logout();
          return false;
        }
      } catch (error) {
        console.error('Invalid token:', error);
        this.logout();
        return false;
      }
    }
    return false;
  }


  async login(email: string, password: string): Promise<boolean> {
    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      console.log('Making login request to:', '/auth/login');
      console.log('Request data:', { email: email.trim().toLowerCase(), password: '[HIDDEN]' });

      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email: email.trim().toLowerCase(),
        password
      });

      console.log('Login response received:', {
        status: response.status,
        hasAccessToken: response.data.token,
        hasUser: response.data.user
      });

      if (response.status == 200 && response.data.token) {
        this.appState.isAuthenticated = true;

        // Store tokens and user info (matching your main.js pattern)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('authToken', response.data.token);
        if (response.data.refresh_token) {
          localStorage.setItem('refreshToken', response.data.refresh_token);
        }

        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_role', response.data.user.role);
        this.appState.user = response.data.user;

        console.log('Login successful, tokens stored');
        return true;
      } else {
        console.error('Login failed - invalid response:', response.data);
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error caught:', error);

      // Check if it's an axios error with response
      if (error.response) {
        console.error('Server responded with error:', {
          status: error.response.status,
          data: error.response.data
        });

        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;

        // Handle specific HTTP status codes
        if (status === 400) {
          throw new Error(serverMessage || 'Please provide both email and password');
        } else if (status === 401) {
          throw new Error(serverMessage || 'Invalid credentials');
        } else if (status === 403) {
          throw new Error(serverMessage || 'Account access denied');
        } else if (status === 404) {
          throw new Error('Login endpoint not found');
        } else if (status >= 500) {
          throw new Error(serverMessage || 'Server error. Please try again later.');
        } else {
          throw new Error(serverMessage || `Login failed (${status})`);
        }
      }
      // Check if it's a network error (no response received)
      else if (error.request) {
        console.error('Network error - no response received:', error.request);
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      // Check for specific error codes
      else if (error.code === 'ERR_NETWORK') {
        console.error('Network/CORS error:', error);
        throw new Error('Network error. Please check your connection and try again.');
      }
      // Handle custom validation errors (thrown earlier in this function)
      else if (error.message === 'Please enter both email and password') {
        throw error;
      }
      // Handle any other errors
      else {
        console.error('Unexpected error type:', error);
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  }

  async signup(
    username: string,
    email: string,
    password: string,
    role: string,
    walletAddress?: string,
    companyName?: string
  ): Promise<{ success: boolean; needsVerification?: boolean; message?: string }> {
    try {
      const signupData: any = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        role
      };

      // Add manufacturer-specific fields (matching main.js pattern)
      if (role === 'manufacturer') {
        if (walletAddress) signupData.wallet_address = walletAddress.trim();
        if (companyName) signupData.company_name = companyName.trim();
      }

      const response = await apiClient.post<SignupResponse>('/auth/signup', signupData);

      if (response.status === 201 || response.status === 200) {
        return {
          success: true,
          needsVerification: true,
          message: response.data.message || 'Registration successful! Please check your email for verification.'
        };
      } else {
        throw new Error(response.data.error || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || error.data?.error || 'Signup failed');
    }
  }
  
// In your AuthService
async updateUserProfile(profileData: Partial<User>): Promise<User> {
  try {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiClient.put<ProfileResponse>('/profile', profileData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200 && response.data?.user) {
      // Update local state and cache
      this.appState.user = response.data.user;
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('lastProfileFetch', Date.now().toString());
      
      return response.data.user;
    } else {
      throw new Error(response.data?.error || 'Profile update failed');
    }
  } catch (error: any) {
    console.error('Profile update error:', error);
    
    if (error.response?.status === 401) {
      this.logout();
      throw new Error('Authentication failed');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Profile update failed');
  }
}

  // Email verification function
  async verifyEmail(token: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post<EmailVerificationResponse>('/auth/verify-email', {
        token
      });

      if (response.status === 200) {
        return {
          success: true,
          message: response.data.message || 'Email verified successfully!'
        };
      } else {
        throw new Error(response.data.error || 'Email verification failed');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw new Error(error.message || 'Email verification failed');
    }
  }

  // Resend verification email function
  async resendVerificationEmail(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post('/auth/resend-verification', {
        email: email.trim().toLowerCase()
      });

      if (response.status === 200) {
        return {
          success: true,
          message: response.data.message || 'Verification email sent successfully!'
        };
      } else {
        throw new Error(response.data.error || 'Failed to resend verification email');
      }
    } catch (error: any) {
      console.error('Resend verification error:', error);
      throw new Error(error.message || 'Failed to resend verification email');
    }
  }

  // Load user profile 
  async loadUserProfile(role?: string, forceRefresh: boolean = false): Promise<User | null> {
    try {
      console.log('loadUserProfile called:', { role, forceRefresh });

      // If not forcing refresh, try to get user data from localStorage first
      if (!forceRefresh) {
        const storedUser = localStorage.getItem('user');
        const lastProfileFetch = localStorage.getItem('lastProfileFetch');
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache

        if (storedUser && lastProfileFetch) {
          const timeSinceLastFetch = Date.now() - parseInt(lastProfileFetch);

          if (timeSinceLastFetch < cacheExpiry) {
            try {
              const user = JSON.parse(storedUser) as User;
              this.appState.user = user;
              console.log('Using cached user profile:', user.username);
              return user;
            } catch (parseError) {
              console.warn('Failed to parse stored user data:', parseError);
              // Clear corrupted data
              localStorage.removeItem('user');
              localStorage.removeItem('lastProfileFetch');
            }
          } else {
            console.log('Cache expired, fetching fresh profile...');
          }
        } else {
          console.log('No cached profile found, fetching from API...');
        }
      } else {
        console.log('Force refresh requested, bypassing cache...');
      }

      // Get the auth token
      const token = this.getToken();
      if (!token) {
        console.error('No authentication token found');
        throw new Error('No authentication token found');
      }

      // Fallback or forced refresh: Make API call
      console.log('Fetching user profile from API...');
      const endpoint = role === 'manufacturer' ? '/manufacturer/profile' : '/customer/profile';

      const response = await apiClient.get<ProfileResponse>(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status && response.data?.user) {
        this.appState.user = response.data.user;

        // Store the fresh data in localStorage with timestamp
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('lastProfileFetch', Date.now().toString());

        console.log('User profile loaded from API:', response.data.user.username);
        return response.data.user;
      } else {
        throw new Error('Failed to load profile');
      }

    } catch (error: any) {
      console.error('Profile loading error:', error);

      // Handle different types of errors
      if (error.response?.status === 401 || error.status === 401) {
        console.log('Authentication failed (401), clearing session...');
        this.logout();
        return null;
      }

      if (error.response?.status === 403) {
        console.log('Access forbidden (403), insufficient permissions');
        throw new Error('Access denied. You do not have permission to access this resource.');
      }

      if (error.code === 'ERR_NETWORK' || !error.response) {
        console.log('Network error, server might be unavailable');
        throw new Error('Unable to connect to server. Please check your connection and try again.');
      }

      throw error;
    }
  }

  // Helper method to get token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Method to clear cached profile (call this on logout)
  clearProfileCache(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('lastProfileFetch');
  }

  // Enhanced logout method
  logout(): void {
    localStorage.removeItem('authToken');
    this.clearProfileCache();
    this.appState.user = null;
    this.appState.isAuthenticated = false;
    // Redirect to login or handle as needed
  }

  // Method to refresh profile (useful for manual refresh)
  async refreshUserProfile(role?: string): Promise<User | null> {
    return this.loadUserProfile(role, true);
  }

   
  // Utility methods matching main.js patterns
  formatWalletAddress(address: string): string {
    if (!address) return 'No wallet';
    if (address.length > 20) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    return address;
  }

  isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Verification status helpers
  isUserVerified(): boolean {
    return this.appState.user?.is_auth_verified ?? false;
  }

  isUserApproved(): boolean {
    return this.appState.user?.wallet_verification_status === 'verified';
  }

  getUserVerificationStatus(): string | null {
    return this.appState.user?.wallet_verification_status ?? null;
  }

  // Generate random serial number (from main.js)
  generateSerialNumber(): string {
    const prefix = 'TEST';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Get redirect URL based on user role (from main.js)
  getRedirectUrl(): string {
    if (!this.appState.user) return '/';

    switch (this.appState.user.role) {
      case 'manufacturer':
        return '/dashboard';
      case 'developer':
        return '/developer';
      default:
        return '/';
    }
  }

  // Initialize app (equivalent to initializeApp from main.js)
  initializeApp(): void {
    // Check if user is logged in
    this.checkAuthStatus();

    // Set up axios-like defaults for apiClient if needed
    // This would be handled by your apiClient automatically
  }

}
// Create singleton instance
const authService = AuthService.getInstance();
export default authService;

// Export individual functions for easier migration from main.js
export const checkAuthStatus = () => authService.checkAuthStatus();
export const login = (email: string, password: string) => authService.login(email, password);
export const signup = (username: string, email: string, password: string, role: string, walletAddress?: string, companyName?: string) =>
  authService.signup(username, email, password, role, walletAddress, companyName);
export const logout = () => authService.logout();
export const loadUserProfile = (role?: string) => authService.loadUserProfile(role);
export const verifyEmail = (token: string) => authService.verifyEmail(token);
export const resendVerificationEmail = (email: string) => authService.resendVerificationEmail(email);
export const isValidEthereumAddress = (address: string) => authService.isValidEthereumAddress(address);
export const formatWalletAddress = (address: string) => authService.formatWalletAddress(address);
export const generateSerialNumber = () => authService.generateSerialNumber();