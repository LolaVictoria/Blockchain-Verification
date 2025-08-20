import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import apiClient from '../src/utils/apiClient';

// Types
export interface Manufacturer {
  id: number;
  businessName: string;
  email: string;
  walletAddress: string;
  dateRegistered: string;
  username: string;
  status: string;
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

type AdminAction =
  | { type: 'SET_ACTIVE_TAB'; payload: 'pending' | 'authorized' | 'audit' }
  | { type: 'SET_PENDING_MANUFACTURERS'; payload: Manufacturer[] }
  | { type: 'SET_AUTHORIZED_MANUFACTURERS'; payload: Manufacturer[] }
  | { type: 'SET_AUDIT_LOGS'; payload: AuditLog[] }
  | { type: 'SET_SELECTED_MANUFACTURERS'; payload: number[] }
  | { type: 'TOGGLE_MANUFACTURER_SELECTION'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTHORIZATION_LOADING'; payload: boolean }
  | { type: 'SET_MESSAGE'; payload: { type: 'success' | 'error'; text: string } | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'CLEAR_SELECTIONS' }
  | { type: 'SELECT_ALL_MANUFACTURERS' };

const initialState: AdminState = {
  activeTab: 'pending',
  pendingManufacturers: [],
  authorizedManufacturers: [],
  auditLogs: [],
  selectedManufacturers: [],
  loading: false,
  authorizationLoading: false,
  message: null,
  searchTerm: '',
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_PENDING_MANUFACTURERS':
      return { ...state, pendingManufacturers: action.payload };
    case 'SET_AUTHORIZED_MANUFACTURERS':
      return { ...state, authorizedManufacturers: action.payload };
    case 'SET_AUDIT_LOGS':
      return { ...state, auditLogs: action.payload };
    case 'SET_SELECTED_MANUFACTURERS':
      return { ...state, selectedManufacturers: action.payload };
    case 'TOGGLE_MANUFACTURER_SELECTION':
      return {
        ...state,
        selectedManufacturers: state.selectedManufacturers.includes(action.payload)
          ? state.selectedManufacturers.filter(id => id !== action.payload)
          : [...state.selectedManufacturers, action.payload]
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_AUTHORIZATION_LOADING':
      return { ...state, authorizationLoading: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'CLEAR_SELECTIONS':
      return { ...state, selectedManufacturers: [] };
    case 'SELECT_ALL_MANUFACTURERS':
      return {
        ...state,
        selectedManufacturers: state.selectedManufacturers.length === state.pendingManufacturers.length
          ? []
          : state.pendingManufacturers.map(m => m.id)
      };
    default:
      return state;
  }
}

interface AdminContextType {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
  actions: {
    loadData: () => Promise<void>;
    batchAuthorizeManufacturers: (manufacturerIds: number[]) => Promise<void>;
    selectManufacturer: (id: number) => void;
    selectAllManufacturers: () => void;
    setActiveTab: (tab: 'pending' | 'authorized' | 'audit') => void;
    setSearchTerm: (term: string) => void;
    clearMessage: () => void;
    refreshData: () => Promise<void>;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// API functions
const adminApi = {
  getPendingManufacturers: async () => {
    const response = await apiClient.request('/admin/manufacturers/pending', 'GET');
    return response;
  },
  
  getAuthorizedManufacturers: async () => {
    const response = await apiClient.request('/admin/manufacturers/authorized', 'GET');
    return response;
  },
  
  batchAuthorizeManufacturers: async (manufacturerIds: number[]) => {
    const response = await apiClient.request('/admin/manufacturers/authorize/batch', 'POST', {
      manufacturerIds
    });
    return response;
  },
  
  getAuditLogs: async () => {
    const response = await apiClient.request('/admin/audit-logs', 'GET');
    return response;
  }
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  const loadData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [pendingResult, authorizedResult, auditResult] = await Promise.all([
        adminApi.getPendingManufacturers(),
        adminApi.getAuthorizedManufacturers(),
        adminApi.getAuditLogs()
      ]);

      if (pendingResult.status === 200) {
        dispatch({ type: 'SET_PENDING_MANUFACTURERS', payload: pendingResult.data });
      }
      if (authorizedResult.status === 200) {
        dispatch({ type: 'SET_AUTHORIZED_MANUFACTURERS', payload: authorizedResult.data });
      }
      if (auditResult.status === 200) {
        dispatch({ type: 'SET_AUDIT_LOGS', payload: auditResult.data });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_MESSAGE', 
        payload: { type: 'error', text: 'Failed to load data' } 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const batchAuthorizeManufacturers = async (manufacturerIds: number[]) => {
    if (manufacturerIds.length === 0) return;

    dispatch({ type: 'SET_AUTHORIZATION_LOADING', payload: true });
    try {
      const result = await adminApi.batchAuthorizeManufacturers(manufacturerIds);
      
      if (result.status === 200) {
        dispatch({ 
          type: 'SET_MESSAGE', 
          payload: { 
            type: 'success', 
            text: `Successfully authorized ${manufacturerIds.length} manufacturers. Transaction: ${result.data.txHash}` 
          } 
        });
        dispatch({ type: 'CLEAR_SELECTIONS' });
        await loadData(); // Refresh data
      } else {
        dispatch({ 
          type: 'SET_MESSAGE', 
          payload: { type: 'error', text: result.data.message || 'Authorization failed' } 
        });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_MESSAGE', 
        payload: { type: 'error', text: 'Authorization failed. Please try again.' } 
      });
    } finally {
      dispatch({ type: 'SET_AUTHORIZATION_LOADING', payload: false });
    }
  };

  const actions = {
    loadData,
    batchAuthorizeManufacturers,
    selectManufacturer: (id: number) => {
      dispatch({ type: 'TOGGLE_MANUFACTURER_SELECTION', payload: id });
    },
    selectAllManufacturers: () => {
      dispatch({ type: 'SELECT_ALL_MANUFACTURERS' });
    },
    setActiveTab: (tab: 'pending' | 'authorized' | 'audit') => {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    },
    setSearchTerm: (term: string) => {
      dispatch({ type: 'SET_SEARCH_TERM', payload: term });
    },
    clearMessage: () => {
      dispatch({ type: 'SET_MESSAGE', payload: null });
    },
    refreshData: loadData,
  };

  return (
    <AdminContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}