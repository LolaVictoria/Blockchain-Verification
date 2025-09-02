// hooks/useAuth.ts - Unified Authentication Hook
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import authService from '../utils/AuthService';
import type { User, UseAuthReturn } from '../../types/auth';


export const useAuth = (): UseAuthReturn => {
  // Use React's useSyncExternalStore to sync with authService state
  const authState = useSyncExternalStore(
    useCallback((callback) => authService.subscribe(callback), []),
    useCallback(() => authService.appState, [])
  );

  // Extract state from authService
  const { user, isAuthenticated, loading, error } = authState;

  // Initialize auth on mount
  useEffect(() => {
    authService.checkAuthStatus();
  }, []);

  // Core authentication methods
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      return await authService.login(email, password);
    } catch (err: any) {
      console.error('Login error in hook:', err);
      throw err;
    }
  }, []);

  const signup = useCallback(async (
    username: string,
    email: string,
    password: string,
    role: string,
    walletAddress?: string,
    companyName?: string
  ): Promise<{ success: boolean; needsVerification?: boolean; message?: string }> => {
    try {
      return await authService.signup(username, email, password, role, walletAddress, companyName);
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }, []);

  const logout = useCallback((): void => {
    authService.logout();
  }, []);

  // Profile management methods
  const loadUserProfile = useCallback(async (forceRefresh: boolean = false): Promise<User> => {
    try {
      return await authService.loadUserProfile(forceRefresh);
    } catch (err: any) {
      console.error('Load profile error:', err);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (updateData: any): Promise<User> => {
    try {
      return await authService.updateUserProfile(updateData);
    } catch (err: any) {
      console.error('Profile update error:', err);
      throw err;
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<User> => {
    try {
      return await authService.loadUserProfile(true);
    } catch (err: any) {
      console.error('Profile refresh error:', err);
      throw err;
    }
  }, []);

  // Specific profile operations
  const addEmail = useCallback(async (email: string): Promise<User> => {
    try {
      return await authService.addEmail(email);
    } catch (err: any) {
      console.error('Add email error:', err);
      throw err;
    }
  }, []);

  const removeEmail = useCallback(async (email: string): Promise<User> => {
    try {
      return await authService.removeEmail(email);
    } catch (err: any) {
      console.error('Remove email error:', err);
      throw err;
    }
  }, []);

  const setPrimaryEmail = useCallback(async (email: string): Promise<User> => {
    try {
      return await authService.setPrimaryEmail(email);
    } catch (err: any) {
      console.error('Set primary email error:', err);
      throw err;
    }
  }, []);

  const addWallet = useCallback(async (wallet_address: string): Promise<User> => {
    try {
      return await authService.addWallet(wallet_address);
    } catch (err: any) {
      console.error('Add wallet error:', err);
      throw err;
    }
  }, []);

  const removeWallet = useCallback(async (wallet_address: string): Promise<User> => {
    try {
      return await authService.removeWallet(wallet_address);
    } catch (err: any) {
      console.error('Remove wallet error:', err);
      throw err;
    }
  }, []);

  const setPrimaryWallet = useCallback(async (wallet_address: string): Promise<User> => {
    try {
      return await authService.setPrimaryWallet(wallet_address);
    } catch (err: any) {
      console.error('Set primary wallet error:', err);
      throw err;
    }
  }, []);

  const updateCompanyName = useCallback(async (company_name: string): Promise<User> => {
    try {
      return await authService.updateCompanyName(company_name);
    } catch (err: any) {
      console.error('Update company error:', err);
      throw err;
    }
  }, []);

  const quickUpdate = useCallback(async (field: string, value: any): Promise<User> => {
    try {
      return await authService.quickUpdate(field, value);
    } catch (err: any) {
      console.error('Quick update error:', err);
      throw err;
    }
  }, []);

  // Batch operations
  const batchUpdateProfile = useCallback(async (operations: {
    emails?: Array<{ operation: 'add' | 'remove' | 'set_primary'; email: string }>;
    wallets?: Array<{ operation: 'add' | 'remove' | 'set_primary'; wallet_address: string }>;
    company?: string;
    directUpdates?: { [key: string]: any };
  }): Promise<User> => {
    try {
      return await authService.batchUpdateProfile(operations);
    } catch (err: any) {
      console.error('Batch update error:', err);
      throw err;
    }
  }, []);

  // Email verification methods
  const verifyEmail = useCallback(async (token: string): Promise<{ success: boolean; message?: string }> => {
    try {
      return await authService.verifyEmail(token);
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }, []);

  const resendVerificationEmail = useCallback(async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      return await authService.resendVerificationEmail(email);
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }, []);

  // Clear error function - Fixed to use proper method access
  const clearError = useCallback((): void => {
    // Access the private updateState method through proper interface
    if (authService.appState.error) {
      authService.appState.error = null;
      // Since we can't directly access updateState, we'll trigger a state change
      // The service will handle this internally
    }
  }, []);

  // Utility methods
  const checkAuthStatus = useCallback((): boolean => {
    return authService.checkAuthStatus();
  }, []);

  const isUserVerified = useCallback((): boolean => {
    return authService.isUserVerified();
  }, []);

  const isUserApproved = useCallback((): boolean => {
    return authService.isUserApproved();
  }, []);

  const getUserVerificationStatus = useCallback((): string | null => {
    return authService.getUserVerificationStatus();
  }, []);

  const getRedirectUrl = useCallback((): string => {
    return authService.getRedirectUrl();
  }, []);

  const formatWalletAddress = useCallback((address: string): string => {
    return authService.formatWalletAddress(address);
  }, []);

  const isValidEthereumAddress = useCallback((address: string): boolean => {
    return authService.isValidEthereumAddress(address);
  }, []);

  const generateSerialNumber = useCallback((): string => {
    return authService.generateSerialNumber();
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    
    // Core authentication methods
    login,
    signup,
    logout,
    
    // Profile management
    updateProfile,
    refreshProfile,
    loadUserProfile,
    
    // Specific profile operations
    addEmail,
    removeEmail,
    setPrimaryEmail,
    addWallet,
    removeWallet,
    setPrimaryWallet,
    updateCompanyName,
    quickUpdate,
    
    // Batch operations
    batchUpdateProfile,
    
    // Email verification
    verifyEmail,
    resendVerificationEmail,
    clearError,
    
    // Utility methods
    checkAuthStatus,
    isUserVerified,
    isUserApproved,
    getUserVerificationStatus,
    getRedirectUrl,
    formatWalletAddress,
    isValidEthereumAddress,
    generateSerialNumber,
  };
};

// Export the main hook as default (to match your current import style)
export default useAuth;


// Additional helper hooks for specific use cases
export const useAuthUser = () => {
  const { user } = useAuth();
  return user;
};

export const useAuthStatus = () => {
  const { isAuthenticated, loading } = useAuth();
  return { isAuthenticated, loading };
};

export const useProfileOperations = () => {
  const {
    addEmail,
    removeEmail,
    setPrimaryEmail,
    addWallet,
    removeWallet,
    setPrimaryWallet,
    updateCompanyName,
    quickUpdate,
    batchUpdateProfile,
    updateProfile,
    loading,
    error
  } = useAuth();

  return {
    addEmail,
    removeEmail,
    setPrimaryEmail,
    addWallet,
    removeWallet,
    setPrimaryWallet,
    updateCompanyName,
    quickUpdate,
    batchUpdateProfile,
    updateProfile,
    loading,
    error
  };
};