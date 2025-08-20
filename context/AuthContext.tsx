import React, { createContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "../types";
import apiClient from "../src/utils/apiClient";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.request("/auth/login", "POST", { email, password });
      
      if (response.status === 200 && response.data?.success && response.data?.data) {
        // Updated to match new backend response structure
        const userData = response.data.data.user;
        const accessToken = response.data.data.access_token;
        const refreshToken = response.data.data.refresh_token;
        
        setUser(userData);
        
        // Save tokens and user data
        localStorage.setItem("token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(userData));
        
        return true;
      } else if (response.status === 401) {
        // Handle authentication errors from new backend
        const errorMessage = response.data?.message || response.data?.error || "Login failed";
        if (errorMessage.includes("verify your email")) {
          setError("Please verify your email address before logging in. Check your inbox for the verification link.");
        } else {
          setError(errorMessage);
        }
        return false;
      }
      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        "Login failed";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    role: string,
    walletAddress?: string
  ): Promise<{ success: boolean; needsVerification?: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    // Prepare request data matching backend expectations
    const requestData = { 
      username, 
      email, 
      password, 
      role,
      wallet_address: walletAddress 
    };
    
    try {
      const response = await apiClient.request("/auth/signup", "POST", requestData);
      
      if (response.status === 201 && response.data?.success) {
        // Updated to match new backend response structure
        const responseData = response.data.data;
        const message = responseData.data.message;
        
        return { 
          success: true, 
          needsVerification: true, 
          message: message || 'Registration successful. Please check your email for verification.'
        };
      } else {
        const errorMsg = response.data?.message || response.data?.error || "Signup failed";
        setError(errorMsg);
        return { success: false };
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Signup failed due to an unknown error";
      setError(backendMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.request(`/auth/verify-email/${token}`, "POST");
      
      if (response.status === 200 && response.data?.success) {
        return { 
          success: true, 
          message: response.data?.message || 'Email verified successfully!' 
        };
      } else {
        const errorMsg = response.data?.message || response.data?.error || "Email verification failed";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error: any) {
      console.error("Email verification error:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        "Email verification failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.request("/auth/resend-verification", "POST", { email });
      
      if (response.status === 200 && response.data?.success) {
        return { 
          success: true, 
          message: response.data?.message || 'Verification email sent successfully!' 
        };
      } else {
        const errorMsg = response.data?.message || response.data?.error || "Failed to resend verification email";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error: any) {
      console.error("Resend verification error:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        "Failed to resend verification email";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async (id: string): Promise<User | null> => {
    setLoading(true);
    try {
      const response = await apiClient.request("/auth/profile", "GET", id ? { id } : undefined, {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      });

      if (response.status === 200 && response.data?.success && response.data?.data) {
        // Updated to match new backend response structure
        const userData = response.data.data.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Fetch current user error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkTokenValidity = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await apiClient.request("/auth/check-token", "GET", null, {
        Authorization: `Bearer ${token}`,
      });

      return response.status === 200 && response.data?.success;
    } catch (error) {
      console.error("Token check error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call backend logout endpoint if token exists
      const token = localStorage.getItem("token");
      if (token) {
        await apiClient.request("/auth/logout", "POST", null, {
          Authorization: `Bearer ${token}`,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if backend call fails
    } finally {
      // Clear local state and storage
      setUser(null);
      setError(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Check if user is verified (email verification)
  const isUserVerified = (): boolean => {
    return user?.is_auth_verified || false;
  };

  // Check if user is approved (for manufacturers - wallet verification)
  const isUserApproved = (): boolean => {
    return user?.wallet_verification_status === 'verified' || user?.role === 'developer';
  };

  // Get user verification status
  const getUserVerificationStatus = (): 'pending' | 'verified' | 'rejected' | null => {
    return user?.wallet_verification_status || null;
  };

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Optionally verify token validity
        checkTokenValidity().then((isValid) => {
          if (!isValid) {
            logout(); // Clear invalid session
          }
        });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        signup,
        logout,
        error,
        setError,
        fetchCurrentUser,
        verifyEmail,
        resendVerificationEmail, 
        clearError, 
        isUserVerified,
        isUserApproved,
        getUserVerificationStatus,
        checkTokenValidity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};