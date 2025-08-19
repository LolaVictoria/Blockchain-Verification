// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "../types";
import apiClient from "../src/utils/apiClient"; 


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
      setUser(response.data.user);  
      // If your API also returns a token, you can save it:
      localStorage.setItem("token", response.data.access_token);
      

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

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);

const signup = async (
  username: string,
  email: string,
  password: string,
  role: string,
  walletAddress?: string
): Promise<boolean> => {
  setLoading(true);
  
  const requestData = {
    username,
    email,
    password,
    role,
    walletAddress,
  };
  
  console.log("Sending signup request:", requestData);
  console.log("Request URL:", `${import.meta.env.VITE_ENDPOINT}/auth/signup`);
  
  try {
    const response = await apiClient.request("/auth/signup", "POST", requestData);
    
    console.log("Full response:", response);
    
    if (response.status === 201 || response.status === 200) {
      return true;
    } else {
      console.error("Signup failed with status:", response.status);
      console.error("Server response:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Signup error:", error);
    return false;
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
