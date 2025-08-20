// Types

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'developer' | 'manufacturer';
  wallet_address?: string;
  is_auth_verified: boolean;
  is_admin: boolean;
  is_active: boolean;
  created_at?: string;
  auth_verification_status: boolean
  updated_at?: string; 
  wallet_verification_status: 'pending' | 'verified' | 'rejected';
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    username: string,
    email: string,
    password: string,
    role: string,
    walletAddress?: string
  ) => Promise<{ success: boolean; needsVerification?: boolean; message?: string }>;
  logout: () => Promise<void>;
  
  // Email verification methods
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; message?: string }>;
  
  // User profile methods
  fetchCurrentUser: (id: string) => Promise<User | null>;
  
  // Utility methods
  clearError: () => void;
  isUserVerified: () => boolean;
  isUserApproved: () => boolean;
  getUserVerificationStatus: () => 'pending' | 'verified' | 'rejected' | null;
  checkTokenValidity: () => Promise<boolean>;
}




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

export interface Product {
  _id?: string;
  serial_number: string;
  product_name: string;
  category: string;
  description?: string;
  manufacturer_id: string;
  manufacturer_address: string;
  blockchain_tx_hash: string;
  registered_at: string;
  verified: boolean;
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
  admin: AdminUser | null;
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
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  authenticated: boolean;
}

export interface SignupResponse {
  user_id: string;
  message: string;
  email_sent: boolean;
}

export interface ProfileResponse {
  user: User;
  profile_loaded: boolean;
}

export interface EmailVerificationResponse {
  message: string;
  user_id: string;
  verified: boolean;
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

// Hook return types
export interface UseAuthReturn extends AuthContextType {}

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
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type UserRole = 'manufacturer' | 'developer';

// Token payload type (for JWT decoding if needed)
export interface TokenPayload {
  identity: string;
  role: UserRole;
  user_id: string;
  username: string;
  is_verified: boolean;
  is_admin: boolean;
  verification_status: VerificationStatus;
  exp: number;
  iat: number;
}
