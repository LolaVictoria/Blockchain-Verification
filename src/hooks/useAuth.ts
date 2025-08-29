import { useState, useEffect, useCallback } from 'react';
import authService from '../utils/AuthService';
import { utilityService } from '../utils/Product&DashboardService';
import type { User, AuthContextType } from '../../types/auth';

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const isAuthenticated = authService.checkAuthStatus();
      if (isAuthenticated && authService.appState.user) {
        setUser(authService.appState.user);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const success = await authService.login(email, password);
      if (success && authService.appState.user) {
        setUser(authService.appState.user);
        console.log(user)
        utilityService.updateUIForAuthentication(authService.appState.user);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup function - updated to match your requirements
  const signup = useCallback(async (
    username: string,
    email: string,
    password: string,
    role: string,
    walletAddress?: string,
    companyName?: string
  ): Promise<{ success: boolean; needsVerification?: boolean; message?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signup(username, email, password, role, walletAddress, companyName);
      return result;
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      // Even if logout API fails, clear local state
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify email function
  const verifyEmail = useCallback(async (token: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.verifyEmail(token);
      return result;
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Resend verification email function
  const resendVerificationEmail = useCallback(async (email: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.resendVerificationEmail(email);
      return result;
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);


  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
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

  return {
    user,
    setUser,
    loading,
    error,
    setError,
    login,
    signup,
    logout,
    verifyEmail,
    resendVerificationEmail,
    clearError,
    isUserVerified,
    isUserApproved,
    getUserVerificationStatus,
  };
};

// Export as default for backward compatibility
export default useAuth;