// types.ts

export interface User {
  id: string;
  primary_email: string;
  emails: string[];
  role: 'manufacturer' | 'customer' | 'admin';
  current_company_name?: string;
  company_names: string[];
  primary_wallet?: string;
  wallet_addresses: string[];
  verified_wallets: string[];
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
  name?: string;
  full_name?: string;
  wallet_address?: string; // For customer role
}

export interface Product {
  id: string;
  serial_number: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  manufacturer_id: string;
  manufacturer_name: string;
  blockchain_verified: boolean;
  blockchain_tx_hash?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_products: number;
  blockchain_verified: number;
  total_value: number;
  categories: Record<string, number>;
}

export interface AuthState {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ProfileState {
  user: User;
  loading: boolean;
  error: string | null;
}

export interface DashboardState {
  stats: DashboardStats | null;
  products: Product[];
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  error?: string;
  data?: T;
  user?: User;
  token?: string;
  stats?: DashboardStats;
  products?: Product[];
}

// Profile update types
export interface EmailData {
  email: string;
  isPrimary: boolean;
  isVerified: boolean;
}

export interface WalletData {
  address: string;
  label?: string;
  isPrimary: boolean;
  isVerified: boolean;
}

export interface CompanyData {
  name: string;
  isCurrent: boolean;
  updatedAt: string;
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

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  role: 'manufacturer' | 'customer';
  wallet_address?: string;
  company_name?: string;
  full_name?: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  error?: string;
  token?: string;
  user?: User;
}

// Product registration types
export interface ProductRegistrationRequest {
  serial_number: string;
  name: string;
  category: string;
  description?: string;
  price: number;
}

// Verification types
export interface VerificationResult {
  status: 'authentic' | 'counterfeit' | 'not_found';
  product?: Product;
  blockchain_data?: {
    tx_hash: string;
    block_number: number;
    verified_on: string;
  };
  ownership_history?: {
    owner: string;
    timestamp: string;
    transaction_hash: string;
  }[];
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Hook return types
export interface UseAuthReturn {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export interface UseProfileReturn {
  user: User;
  loading: boolean;
  error: string | null;
  updateProfile: (user: User) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface UseDashboardReturn {
  stats: DashboardStats | null;
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshDashboard: () => Promise<void>;
  addProduct: (product: ProductRegistrationRequest) => Promise<void>;
}

// Component prop types
export interface EditProfileProps {
  onClose: () => void;
  userId: string;
  userRole: 'manufacturer' | 'customer';
}

export interface DashboardProps {
  userId?: string;
}

// Modal types
export interface ModalState {
  addEmail: boolean;
  addWallet: boolean;
  updateCompany: boolean;
}

// Alert types
export interface Alert {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
}

// Cache types
export interface CacheItem<T> {
  data: T;
  timestamp: Date;
  isEmpty?: boolean;
}

export interface CacheManager {
  get: <T>(key: string) => CacheItem<T> | null;
  set: <T>(key: string, data: T, isEmpty?: boolean) => void;
  clear: (key: string) => void;
  clearAll: () => void;
  isValid: (key: string, maxAge?: number) => boolean;
}

// Route types
export interface RouteProps {
  path: string;
  element: React.ComponentType<any>;
  protected?: boolean;
  roles?: string[];
}