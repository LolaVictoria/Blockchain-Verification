import React, { createContext, useContext, useReducer, type ReactNode, useEffect } from 'react';
import apiClient from '../src/utils/apiClient';
import type { AdminUser , AuthState} from '../types'; 



type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AdminUser }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESET_ERROR' }
  | { type: 'INCREMENT_ATTEMPTS' }
  | { type: 'RESET_ATTEMPTS' };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  admin: null,
  error: null,
  loginAttempts: 0,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        admin: action.payload,
        error: null,
        loginAttempts: 0,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        admin: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'RESET_ERROR':
      return { ...state, error: null };
    case 'INCREMENT_ATTEMPTS':
      return { ...state, loginAttempts: state.loginAttempts + 1 };
    case 'RESET_ATTEMPTS':
      return { ...state, loginAttempts: 0 };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  actions: {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    resetError: () => void;
    checkAuthStatus: () => Promise<void>;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

// RPC-style authentication
interface RPCAuthRequest {
  method: 'admin.authenticate';
  params: {
    email: string;
    password: string;
    timestamp: number;
  };
  id: string;
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication API
const authApi = {
  // Option 1: Standard REST authentication
  loginStandard: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/admin/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response;
  },

  // Option 2: RPC-style authentication
  loginRPC: async (credentials: LoginCredentials) => {
    const rpcRequest: RPCAuthRequest = {
      method: 'admin.authenticate',
      params: {
        email: credentials.email,
        password: credentials.password,
        timestamp: Date.now(),
      },
      id: `auth_${Date.now()}`,
    };

    const response = await apiClient.post('/rpc/admin', rpcRequest);
    return response;
  },

  // Verify existing token
  verifyToken: async () => {
    const response = await apiClient.get('/admin/auth/verify');
    return response;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/admin/auth/logout');
    return response;
  },
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      dispatch({ type: 'LOGIN_START' });
      const result = await authApi.verifyToken();
      
      if (result.status === 200 && result.data.valid) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: result.data.admin,
        });
      } else {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    // Check for too many attempts
    if (state.loginAttempts >= 5) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Too many login attempts. Please try again later.',
      });
      return;
    }

    dispatch({ type: 'LOGIN_START' });

    try {
      // Choose authentication method (RPC vs Standard)
      const useRPC = import.meta.env.VITE_USE_RPC_AUTH === 'true';
      const result = useRPC 
        ? await authApi.loginRPC(credentials)
        : await authApi.loginStandard(credentials);

      if (result.status === 200) {
        const { token, admin } = result.data;
        
        // Store token
        localStorage.setItem('token', token);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            ...admin,
            loginTime: new Date().toISOString(),
          },
        });
      } else {
        dispatch({ type: 'INCREMENT_ATTEMPTS' });
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: result.data?.message || 'Invalid credentials',
        });
      }
    } catch (error) {
      dispatch({ type: 'INCREMENT_ATTEMPTS' });
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Authentication failed. Please try again.',
      });
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const resetError = () => {
    dispatch({ type: 'RESET_ERROR' });
  };

  const actions = {
    login,
    logout,
    resetError,
    checkAuthStatus,
  };

  return (
    <AdminAuthContext.Provider value={{ state, actions }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Higher-order component for protecting admin routes
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { state } = useAdminAuth();
    
    if (!state.isAuthenticated) {
      return null; // Login component will be rendered instead
    }
    
    return <Component {...props} />;
  };
}