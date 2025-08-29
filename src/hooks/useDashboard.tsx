// hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import type { 
  Product, 
  DashboardStats, 
  FilterType, 
  ProductFormData, 
  TransferFormData 
} from '../../types/dashboard';
import apiClient from '../utils/apiClient';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  // Load dashboard stats
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await apiClient.get<DashboardStats>('/manufacturer/dashboard-stats');
      if (response.status === 200) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ products: Product[] }>('/manufacturer/products');
      if (response.status === 200 && response.data.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter products based on selected filter
  useEffect(() => {
    if (filter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.model === filter));
    }
  }, [products, filter]);

  // Register product on blockchain
  const registerProduct = useCallback(async (productData: ProductFormData) => {
    // This would integrate with your blockchain registration logic
    try {
      const response = await apiClient.post('/manufacturer/register-product', {
        serial_number: productData.serial_number,
        brand: productData.brand,
        model: productData.model,
        device_type: productData.device_type,
        storage_data: productData.storage_data,
        color: productData.color,
        batch_number: productData.batch_number,
        registration_type: 'blockchain_pending'
      });

      if (response.status === 200 || response.status === 201) {
        // Refresh data after successful registration
        await loadProducts();
        await loadStats();
        return { success: true, message: 'Product registered successfully!' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  }, [loadProducts, loadStats]);

  // Transfer ownership
  const transferOwnership = useCallback(async (transferData: TransferFormData) => {
    try {
      const response = await apiClient.put('/products/transfer-ownership', {
        newOwnerAddress: transferData.new_owner,
        transferReason: transferData.transfer_reason,
      });

      if (response.status === 200) {
        await loadProducts();
        await loadStats();
        return { success: true, message: 'Ownership transferred successfully!' };
      }
    } catch (error: any) {
      console.error('Transfer error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Transfer failed' 
      };
    }
  }, [loadProducts, loadStats]);

  // Refresh all dashboard data
  const refreshDashboard = useCallback(async () => {
    await Promise.all([loadStats(), loadProducts()]);
  }, [loadStats, loadProducts]);

  // Initial load
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  return {
    stats,
    products: filteredProducts,
    allProducts: products,
    loading,
    statsLoading,
    filter,
    setFilter,
    loadStats,
    loadProducts,
    registerProduct,
    transferOwnership,
    refreshDashboard
  };
};



