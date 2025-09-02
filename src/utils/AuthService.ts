// utils/AuthService.ts - Unified Authentication & Profile Service
import apiClient from './apiClient';
import type {
  User,
  LoginResponse,
  SignupResponse,
  ProfileResponse,
  EmailVerificationResponse,
  TokenPayload
} from '../../types/auth';

// Profile update interfaces
interface EmailOperation {
  operation: 'add' | 'remove' | 'set_primary';
  email: string;
}

interface WalletOperation {
  operation: 'add' | 'remove' | 'set_primary';
  wallet_address: string;
}

interface ProfileUpdateRequest {
  email_operations?: EmailOperation[];
  wallet_operations?: WalletOperation[];
  company_name?: string;
  direct_updates?: {
    primary_email?: string;
    primary_wallet?: string;
    emails?: string[];
    wallet_addresses?: string[];
    current_company_name?: string;
    [key: string]: any;
  };
}

export class AuthService {
  private static instance: AuthService;
  
  // Single app state - the source of truth
  public appState = {
    user: {} as User,
    isAuthenticated: false,
    loading: false,
    error: null as string | null
  };

  // Subscribers for state changes (for React hooks)
  private subscribers: Set<() => void> = new Set();

  private constructor() {
    this.initializeFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Subscribe to state changes (for React hooks)
  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Notify all subscribers of state changes
  private notify(): void {
    this.subscribers.forEach(callback => callback());
  }

  // Update state and notify subscribers
  private updateState(updates: Partial<typeof this.appState>): void {
    Object.assign(this.appState, updates);
    this.notify();
  }

  // Initialize from localStorage on app startup
  private initializeFromStorage(): void {
    try {
      const token = this.getToken();
      if (token && this.isTokenValid(token)) {
        // Token exists and is valid, set authenticated state
        this.appState.isAuthenticated = true;
        
        // Try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            this.appState.user = JSON.parse(storedUser);
          } catch (e) {
            console.warn('Failed to parse stored user data');
            localStorage.removeItem('user');
          }
        }
      } else {
        this.clearSession();
      }
    } catch (error) {
      console.error('Error initializing from storage:', error);
      this.clearSession();
    }
  }

  // Check if token is valid
  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  // Get user data from token
  private getUserFromToken(token: string): User {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    return {
      id: payload.user_id,
      username: payload.username,
      role: payload.role,
      is_auth_verified: payload.is_verified,
      is_admin: payload.is_admin,
      is_active: true,
      auth_verification_status: payload.is_verified,
      wallet_verification_status: payload.verification_status,
      current_company_name: payload.current_company_name,
      primary_wallet: payload.primary_wallet,
      created_at: payload.created_at || '',
      updated_at: payload.updated_at || '',
      verification_status: payload.verification_status || 'pending',
      company_names: payload.company_names || [],
      emails: payload.emails || [],
      primary_email: payload.primary_email || payload.identity,
      verified_wallets: payload.verified_wallets || [],
      wallet_addresses: payload.wallet_addresses || []
    };
  } catch (error) {
    console.error('Error parsing user from token:', error);
    throw new Error('Invalid token'); // Or return a default user object
  }
}

  // Get current authentication status
checkAuthStatus(): boolean {
  const token = this.getToken();
  if (token && this.isTokenValid(token)) {
    if (!this.appState.user || Object.keys(this.appState.user).length === 0) {
      // First try to get user from localStorage (more complete data)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          this.appState.user = userData;
          this.updateState({ isAuthenticated: true });
          return true;
        } catch (e) {
          console.warn('Failed to parse stored user data, falling back to token');
        }
      }
      
      // Fallback to token data only if localStorage fails
      try {
        const userFromToken = this.getUserFromToken(token);
        if (userFromToken) {
          this.appState.user = userFromToken;
          this.updateState({ isAuthenticated: true });
          return true;
        }
      } catch (e) {
        console.error('Failed to get user from token:', e);
        this.clearSession();
        return false;
      }
    }
    this.updateState({ isAuthenticated: true });
    return true;
  } else {
    this.clearSession();
    return false;
  }
}

  // LOGIN 
  async login(email: string, password: string): Promise<boolean> {
    this.updateState({ loading: true, error: null });

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email: email.trim().toLowerCase(),
        password
      });

      if (response.status === 200 && response.data.token) {
        // Store tokens
        localStorage.setItem('authToken', response.data.token);
        if (response.data.refresh_token) {
          localStorage.setItem('refreshToken', response.data.refresh_token);
        }
        // Store user data
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        console.log(userData)
        localStorage.setItem('user_role', userData.role);

        // Update state
        this.appState.user = userData; 
        this.updateState({
          user: userData,
          isAuthenticated: true,
          loading: false,
          error: null
        });
        return true;
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = this.handleApiError(error, 'Login failed');
      this.updateState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  // SIGNUP
  async signup(
    username: string,
    email: string,
    password: string,
    role: string,
    walletAddress?: string,
    companyName?: string
  ): Promise<{ success: boolean; needsVerification?: boolean; message?: string }> {
    this.updateState({ loading: true, error: null });

    try {
      const signupData: any = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        role
      };

      if (role === 'manufacturer') {
        if (walletAddress) signupData.wallet_address = walletAddress.trim();
        if (companyName) signupData.company_name = companyName.trim();
      }

      const response = await apiClient.post<SignupResponse>('/auth/signup', signupData);

      if (response.status === 201 || response.status === 200) {
        this.updateState({ loading: false, error: null });
        return {
          success: true,
          needsVerification: true,
          message: response.data.message || 'Registration successful! Please check your email for verification.'
        };
      } else {
        throw new Error(response.data.error || 'Signup failed');
      }
    } catch (error: any) {
      const errorMessage = this.handleApiError(error, 'Signup failed');
      this.updateState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  // LOAD/REFRESH USER PROFILE - Consolidated method
  async loadUserProfile(forceRefresh: boolean = false): Promise<User> {
    // Check if user is authenticated
    if (!this.checkAuthStatus()) {
      throw new Error('User not authenticated');
    }

    // If we have user data and not forcing refresh, return cached data
    if (this.appState.user && !forceRefresh) {
      return this.appState.user;
    }

    this.updateState({ loading: true, error: null });

    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Determine endpoint based on user role
      const userRole = this.appState.user?.role || 'customer';
      const endpoint = userRole === 'manufacturer' ? '/manufacturer/profile' : '/customer/profile';

      const response = await apiClient.get<ProfileResponse>(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data?.user) {
        const userData = response.data.user;
        
        // Update localStorage and state
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('lastProfileFetch', Date.now().toString());
        
        this.updateState({
          user: userData,
          loading: false,
          error: null
        });

        return userData;
      } else {
        throw new Error('Failed to load profile');
      }
    } catch (error: any) {
      const errorMessage = this.handleApiError(error, 'Failed to load profile');
      
      if (error.response?.status === 401) {
        this.clearSession();
        throw new Error('Authentication failed');
      }
      
      this.updateState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  // UNIFIED PROFILE UPDATE - Main update method supporting both formats
  async updateUserProfile(updateData: ProfileUpdateRequest | Partial<User>): Promise<User> {
    if (!this.checkAuthStatus()) {
      throw new Error('User not authenticated');
    }

    this.updateState({ loading: true, error: null });

    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Determine endpoint based on user role
      const userRole = this.appState.user?.role || 'manufacturer';
      const endpoint = userRole === 'manufacturer' ? '/manufacturer/profile' : '/profile';

      // Convert legacy format to new format if needed
      const requestData = this.normalizeUpdateData(updateData);

      let response: any;
      
      try {
        // Try PUT first
        response = await apiClient.put<ProfileResponse>(endpoint, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error: any) {
        if (error.response?.status === 405) {
          // Try PATCH as fallback
          //console.log('PUT not supported, trying PATCH...');
          response = await apiClient.patch<ProfileResponse>(endpoint, requestData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          throw error;
        }
      }
      
      if (response.status === 200 && response.data?.user) {
        const updatedUser = response.data.user;
        
        // Update localStorage and state
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('lastProfileFetch', Date.now().toString());
        
        this.updateState({
          user: updatedUser,
          loading: false,
          error: null
        });

        return updatedUser;
      } else {
        throw new Error(response.data?.error || 'Profile update failed');
      }
    } catch (error: any) {
      const errorMessage = this.handleApiError(error, 'Profile update failed');
      
      if (error.response?.status === 401) {
        this.clearSession();
        throw new Error('Authentication failed');
      }
      
      this.updateState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  // Helper method to normalize update data to the new format
  private normalizeUpdateData(updateData: ProfileUpdateRequest | Partial<User>): ProfileUpdateRequest {
    // If it's already in the new format, return as-is
    if ('email_operations' in updateData || 'wallet_operations' in updateData || 'direct_updates' in updateData) {
      return updateData as ProfileUpdateRequest;
    }

    // Convert legacy format
    const normalized: ProfileUpdateRequest = { direct_updates: {} };
    
    const legacyData = updateData as Partial<User>;
    
    if (legacyData.emails) {
      normalized.direct_updates!.emails = legacyData.emails;
    }
    if (legacyData.wallet_addresses) {
      normalized.direct_updates!.wallet_addresses = legacyData.wallet_addresses;
    }
    if (legacyData.primary_email) {
      normalized.direct_updates!.primary_email = legacyData.primary_email;
    }
    if (legacyData.primary_wallet) {
      normalized.direct_updates!.primary_wallet = legacyData.primary_wallet;
    }
    if (legacyData.current_company_name) {
      normalized.company_name = legacyData.current_company_name;
    }

    // Handle other direct updates
    Object.keys(legacyData).forEach(key => {
      if (!['emails', 'wallet_addresses', 'primary_email', 'primary_wallet', 'current_company_name'].includes(key)) {
        normalized.direct_updates![key] = (legacyData as any)[key];
      }
    });

    return normalized;
  }

  // CONVENIENCE METHODS for specific operations
  async addEmail(email: string): Promise<User> {
    return this.updateUserProfile({
      email_operations: [{ operation: 'add', email }]
    });
  }

  async removeEmail(email: string): Promise<User> {
    return this.updateUserProfile({
      email_operations: [{ operation: 'remove', email }]
    });
  }

  async setPrimaryEmail(email: string): Promise<User> {
    return this.updateUserProfile({
      direct_updates: { primary_email: email }
    });
  }

  async addWallet(wallet_address: string): Promise<User> {
    return this.updateUserProfile({
      wallet_operations: [{ operation: 'add', wallet_address }]
    });
  }

  async removeWallet(wallet_address: string): Promise<User> {
    return this.updateUserProfile({
      wallet_operations: [{ operation: 'remove', wallet_address }]
    });
  }

  async setPrimaryWallet(wallet_address: string): Promise<User> {
    return this.updateUserProfile({
      direct_updates: { primary_wallet: wallet_address }
    });
  }

  async updateCompanyName(company_name: string): Promise<User> {
    return this.updateUserProfile({
      company_name
    });
  }

  // BATCH UPDATE - Multiple operations at once
  async batchUpdateProfile(operations: {
    emails?: EmailOperation[];
    wallets?: WalletOperation[];
    company?: string;
    directUpdates?: { [key: string]: any };
  }): Promise<User> {
    const updateRequest: ProfileUpdateRequest = {};
    
    if (operations.emails?.length) {
      updateRequest.email_operations = operations.emails;
    }
    
    if (operations.wallets?.length) {
      updateRequest.wallet_operations = operations.wallets;
    }
    
    if (operations.company) {
      updateRequest.company_name = operations.company;
    }

    if (operations.directUpdates) {
      updateRequest.direct_updates = operations.directUpdates;
    }
    
    return this.updateUserProfile(updateRequest);
  }

  // QUICK UPDATE - Single field changes
  async quickUpdate(field: string, value: any): Promise<User> {
    try {
      // Try the quick update endpoint first
      const response = await apiClient.post('/manufacturer/profile/quick-update', {
        field,
        value
      }, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.user) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.updateState({ user: updatedUser });
        return updatedUser;
      }
      
      return response.data;
    } catch (error: any) {
      // Fallback to unified endpoint
      const directUpdates: any = {};
      directUpdates[field] = value;
      
      return this.updateUserProfile({
        direct_updates: directUpdates
      });
    }
  }

  // EMAIL VERIFICATION
  async verifyEmail(token: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post<EmailVerificationResponse>('/auth/verify-email', { token });
      return {
        success: response.status === 200,
        message: response.data.message || 'Email verified successfully!'
      };
    } catch (error: any) {
      throw new Error(this.handleApiError(error, 'Email verification failed'));
    }
  }

  // RESEND VERIFICATION EMAIL
  async resendVerificationEmail(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post('/auth/resend-verification', {
        email: email.trim().toLowerCase()
      });
      return {
        success: response.status === 200,
        message: response.data.message || 'Verification email sent successfully!'
      };
    } catch (error: any) {
      throw new Error(this.handleApiError(error, 'Failed to resend verification email'));
    }
  }

  // LOGOUT
  logout(): void {
    this.clearSession();
  }

  // Clear all session data
  private clearSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    localStorage.removeItem('lastProfileFetch');
    
    this.updateState({
      user: {} as User,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  }

  // Helper method to get token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Error handling
  private handleApiError(error: any, defaultMessage: string): string {
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400: return serverMessage || 'Invalid request';
        case 401: return serverMessage || 'Invalid credentials';
        case 403: return serverMessage || 'Access denied';
        case 404: return 'Service not found';
        case 500: return serverMessage || 'Server error. Please try again later.';
        default: return serverMessage || `${defaultMessage} (${status})`;
      }
    } else if (error.request) {
      return 'Unable to connect to server. Please check your internet connection.';
    } else if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection and try again.';
    } else {
      return error.message || defaultMessage;
    }
  }

  // Utility methods
  formatWalletAddress(address: string): string {
    if (!address) return 'No wallet';
    return address.length > 20 
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      : address;
  }

  isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  generateSerialNumber(): string {
    const prefix = 'ABCV';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
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

  getRedirectUrl(): string {
    if (!this.appState.user) return '/';
    switch (this.appState.user.role) {
      case 'manufacturer': return '/dashboard';
      case 'developer': return '/developer';
      default: return '/';
    }
  }
}

// Create and export singleton instance
const authService = AuthService.getInstance();
export default authService;