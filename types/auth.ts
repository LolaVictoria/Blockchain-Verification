// Types

export interface User {
  id: string;
  password_hash?: string; 
  // role: 'manufacturer' | 'customer' | 'developer';
  role: string
  created_at: string;
  updated_at: string;
  // verification_status: 'pending' | 'verified' | 'rejected';
  verification_status: string
  
  // Company related
  company_names: string[];
  current_company_name: string;
  
  // Email related
  emails: string[];
  primary_email: string;
  
  // Wallet related
  primary_wallet: string;
  verified_wallets: string[];
  wallet_addresses: string[];
  
  // Additional fields that might exist
  username?: string;
  is_auth_verified?: boolean;
  is_admin?: boolean;
  is_active?: boolean;
  auth_verification_status?: boolean;
  wallet_verification_status?: string;
}
export interface AuthContextType {
  // State
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    username: string,
    email: string,
    password: string,
    role: string,
    walletAddress?: string,
    companyName?: string
  ) => Promise<{ success: boolean; needsVerification?: boolean; message?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<User>;
  updateProfile: (profileData: Partial<User>) => Promise<User>;
  loadUserProfile: (forceRefresh?: boolean) => Promise<User>;
  
  // Specific profile operations
  addEmail: (email: string) => Promise<User>;
  removeEmail: (email: string) => Promise<User>;
  setPrimaryEmail: (email: string) => Promise<User>;
  addWallet: (wallet_address: string) => Promise<User>;
  removeWallet: (wallet_address: string) => Promise<User>;
  setPrimaryWallet: (wallet_address: string) => Promise<User>;
  updateCompanyName: (company_name: string) => Promise<User>;
  quickUpdate: (field: string, value: any) => Promise<User>;
  
  // Batch operations
  batchUpdateProfile: (operations: {
    emails?: Array<{ operation: 'add' | 'remove' | 'set_primary'; email: string }>;
    wallets?: Array<{ operation: 'add' | 'remove' | 'set_primary'; wallet_address: string }>;
    company?: string;
    directUpdates?: { [key: string]: any };
  }) => Promise<User>;
  
  // Email verification
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; message?: string }>;
  clearError: () => void;
  
  // Utility methods
  checkAuthStatus: () => boolean;
  isUserVerified: () => boolean;
  isUserApproved: () => boolean;
  getUserVerificationStatus: () => string | null;
  getRedirectUrl: () => string;
  formatWalletAddress: (address: string) => string;
  isValidEthereumAddress: (address: string) => boolean;
  generateSerialNumber: () => string;
}

// Hook return types - now this will work correctly
export interface UseAuthReturn extends AuthContextType {}




// Form data types
export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'manufacturer' | 'developer' | null;
  walletAddress: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProfileUpdateRequest {
  action: 'add_email' | 'remove_email' | 'set_primary_email' | 
          'add_wallet' | 'set_primary_wallet' | 
          'update_company';
  email?: string;
  wallet_address?: string;
  label?: string;
  company_name?: string;
}

export interface ApiKey {
  _id: string;
  label: string;
  key: string;
  created_at: string;
  last_used?: string;
  usage_count: number;
}



export interface Manufacturer {
  id: number;
  businessName: string;
  email: string;
  walletAddress: string;
  dateRegistered: string;
  username: string;
  auth_verification_status: string;
  dateAuthorized?: string;
  authorizedBy?: string;
  txHash?: string;
}

export interface AuditLog {
  id: number;
  action: string;
  adminEmail: string;
  manufacturersCount: number;
  timestamp: string;
  txHash: string;
  gasUsed: string;
  status: string;
}

export interface AdminState {
  activeTab: 'pending' | 'authorized' | 'audit';
  pendingManufacturers: Manufacturer[];
  authorizedManufacturers: Manufacturer[];
  auditLogs: AuditLog[];
  selectedManufacturers: number[];
  loading: boolean;
  authorizationLoading: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
  searchTerm: string;
}

export interface AdminUser {
  email: string;
  role: 'admin';
  permissions: string[];
  loginTime: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: AdminUser;
  error: string | null;
  loginAttempts: number;
}


// API Response types to match backend
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status: number;
  token: string
}

export interface LoginResponse {
  data: {
    token: string;
    expires_at: string;
    user: User;
    refresh_token?: string;
  };
  message: string;
  success: boolean;
  timestamp: string;
  error?: string;
}

export interface SignupResponse {
  user_id: string;
  message: string;
  email_sent: boolean;
  error?: string;
}

export interface ProfileResponse {
  user: User;
  profile_loaded: boolean;
  error?: string;
  success: boolean;
  message: string
}

export interface EmailVerificationResponse {
  message: string;
  user_id: string;
  verified: boolean;
  error?: string;
}



// API Client types
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export interface ApiError {
  message: string;
  status: number;
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
}

// Component prop types
export interface EmailVerificationProps {
  email: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

export interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  allowedRoles?: ('manufacturer' | 'developer')[];
  fallback?: React.ReactNode;
}

// Verification status types
// export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type VerificationStatus = string
// export type UserRole = 'manufacturer' | 'developer';
export type UserRole = string

// Token payload type (for JWT decoding if needed)
export interface TokenPayload {
  identity: string;
  role: UserRole;
  user_id: string;
  username: string;
  is_verified: boolean;
  is_admin: boolean;
  verification_status: string;
  exp: number;
  iat: number;
  current_company_name: string;
  primary_wallet: string;
  
  // Additional fields from database
  created_at: string;
  updated_at: string;
  company_names: string[];
  emails: string[];
  primary_email: string;
  verified_wallets: string[];
  wallet_addresses: string[];
}