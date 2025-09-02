// contexts/AuthContext.tsx - Simplified Auth Context
import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '../src/hooks/useAuth';
import type { AuthContextType } from "../types/auth"


// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};



export const useAuthActions = () => {
  const { login, logout, signup, refreshProfile, updateProfile, error } = useAuthContext();
  return { login, logout, signup, refreshProfile, updateProfile, error };
};

export default AuthContext;