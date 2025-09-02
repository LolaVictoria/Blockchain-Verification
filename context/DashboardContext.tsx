// context/DashboardContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, FilterType, DashboardStats } from '../types/dashboard';
import { useAuthContext } from './AuthContext';
import apiClient from '../src/utils/apiClient';

interface DashboardContextType {
  // Products state
  products: Product[];
  allProducts: Product[];
  loading: boolean;
  statsLoading: boolean;
  filter: FilterType;
  stats: DashboardStats;
  
  // Actions
  setFilter: (filter: FilterType) => void;
  registerProduct: (productData: any) => Promise<any>;
  transferOwnership: (transferData: any) => Promise<any>;
  refreshDashboard: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const { user } = useAuthContext();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [stats, setStats] = useState<DashboardStats>({
    total_products: 0,
    blockchain_confirmed: 0,
    blockchain_pending: 0,
    blockchain_failed: 0,
    total_transfers: 0,
    recent_activities: []
  });

  // Fetch products
  const fetchProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiClient.get('/dashboard/products');
      const fetchedProducts = response.data.products || [];
      setAllProducts(fetchedProducts);
      
      // Apply current filter
      applyFilter(fetchedProducts, filter);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    if (!user) return;
    
    setStatsLoading(true);
    try {
      const response = await apiClient.get('/dashboard/stats');
      setStats(response.data.stats || stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Apply filter to products
  const applyFilter = (productList: Product[], filterType: FilterType) => {
    let filtered = productList;
    
    switch (filterType) {
      case 'blockchain_confirmed':
        filtered = productList.filter(p => p.blockchain_status === 'confirmed');
        break;
      case 'blockchain_pending':
        filtered = productList.filter(p => p.blockchain_status === 'pending');
        break;
      case 'blockchain_failed':
        filtered = productList.filter(p => p.blockchain_status === 'failed');
        break;
      case 'all':
      default:
        filtered = productList;
        break;
    }
    
    setProducts(filtered);
  };

  // Handle filter change
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    applyFilter(allProducts, newFilter);
  };

  // Register new product
  const registerProduct = async (productData: any) => {
    try {
      const response = await apiClient.post('/products/register', productData);
      
      if (response.data.success) {
        // Refresh products after successful registration
        await fetchProducts();
        await fetchStats();
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error registering product:', error);
      throw error;
    }
  };

  // Transfer ownership
  const transferOwnership = async (transferData: any) => {
    try {
      const response = await apiClient.post('/products/transfer-ownership', transferData);
      
      if (response.data.success) {
        // Refresh products after successful transfer
        await fetchProducts();
        await fetchStats();
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error transferring ownership:', error);
      throw error;
    }
  };

  // Refresh all dashboard data
  const refreshDashboard = async () => {
    await Promise.all([
      fetchProducts(),
      fetchStats()
    ]);
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      refreshDashboard();
    }
  }, [user]);

  // Apply filter when products change
  useEffect(() => {
    applyFilter(allProducts, filter);
  }, [allProducts, filter]);

  const value: DashboardContextType = {
    products,
    allProducts,
    loading,
    statsLoading,
    filter,
    stats,
    setFilter: handleFilterChange,
    registerProduct,
    transferOwnership,
    refreshDashboard,
    fetchProducts,
    fetchStats
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};