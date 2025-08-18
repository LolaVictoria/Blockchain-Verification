// src/context/AuthContext.tsx
import React, { createContext, useState } from "react";
import type { AuthContextType, User } from "../types";
import apiClient from "../src/utils/apiClient"; // <-- you’ll need this helper

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);


const login = async (email: string, password: string): Promise<boolean> => {
  setLoading(true);
  try {
    // Call your REST endpoint
    const response = await apiClient.request("/auth/login", "POST", { email, password });

    if (response.status === 200 && response.data?.user) {
      setUser(response.data.user); // assuming API returns { user, token }
      
      // If your API also returns a token, you can save it:
      // localStorage.setItem("token", response.data.token);

      return true;
    }
    return false;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  } finally {
    setLoading(false);
  }
};


const signup = async (
  email: string,
  password: string,
  role: string,
  walletAddress?: string
): Promise<boolean> => {
  setLoading(true);
  try {
    const response = await apiClient.request("/auth/signup", "POST", {
      email,
      password,
      role,
      walletAddress,
    });

    // Adjust depending on your backend’s response structure
    if (response.status === 201 || response.status === 200) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Signup error:", error);
    return false;
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
