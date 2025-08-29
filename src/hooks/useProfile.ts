// hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import authService from '../utils/AuthService';
import type { User } from '../../types/auth';

interface UseProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

export const useProfile = (role?: 'manufacturer' | 'customer'): UseProfileReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated first
      const isAuthenticated = authService.checkAuthStatus();
      if (!isAuthenticated) {
        console.log('User not authenticated - redirecting to login');
        throw new Error('User not authenticated');
      }

      console.log('Loading user profile...', { role, forceRefresh });
      const userData = await authService.loadUserProfile(role, forceRefresh);
      
      if (userData) {
        setUser(userData);
        console.log('Profile loaded successfully:', userData.username);
      } else {
        throw new Error('Failed to load user profile');
      }
    } catch (err: any) {
      console.error('Profile loading error:', err);
      setError(err.message || 'Failed to load profile');
      setUser(null);
      
      // Handle authentication errors
      if (err.message?.includes('authentication') ||
          err.status === 401 ||
          err.response?.status === 401) {
        console.log('Authentication failed - logging out');
        // Small delay to prevent infinite loops on refresh
        setTimeout(() => {
          authService.logout();
          window.location.href = '/login';
        }, 100);
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [role]);

  const refreshProfile = useCallback(async () => {
    await loadProfile(true);
  }, [loadProfile]);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const isAuthenticated = authService.checkAuthStatus();
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }

      console.log('Updating user profile...', profileData);
      
      // Call your auth service method to update profile
      // You'll need to implement this method in your AuthService
      const updatedUser = await authService.updateUserProfile(profileData);
      
      if (updatedUser) {
        setUser(updatedUser);
        console.log('Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      
      // Handle authentication errors
      if (err.message?.includes('authentication') ||
          err.status === 401 ||
          err.response?.status === 401) {
        console.log('Authentication failed - logging out');
        setTimeout(() => {
          authService.logout();
          window.location.href = '/login';
        }, 100);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load profile on mount
  useEffect(() => {
    loadProfile(false);
  }, [loadProfile]);

  // Listen for auth state changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && !e.newValue) {
        // Token was removed, clear user
        setUser(null);
        setLoading(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,
    loading,
    error,
    refreshProfile,
    updateProfile
  };
};