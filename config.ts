// utils/config.ts - Frontend Configuration
export const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const ANALYTICS_CONFIG = {
  // Default time ranges for analytics
  timeRanges: {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days', 
    '90d': 'Last 90 Days',
    '1y': 'Last Year'
  },
  
  // Device types for filtering
  deviceTypes: [
    'Smartphone', 'Laptop', 'Tablet', 'Desktop', 'Monitor',
    'Camera', 'Audio Device', 'Gaming Console', 'Smart Watch', 'Other'
  ],
  
  // Chart colors for consistency
  chartColors: {
    primary: '#3B82F6',
    success: '#10B981', 
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#8B5CF6',
    secondary: '#6B7280'
  },
  
  // Auto-refresh intervals (in milliseconds)
  refreshIntervals: {
    realTime: 30000, // 30 seconds
    analytics: 300000, // 5 minutes
    alerts: 60000 // 1 minute
  },
  
  // Pagination settings
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100
  }
};

// Authentication helper functions
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

export const getUserRole = (): 'manufacturer' | 'customer' | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const getHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Format utilities for analytics display
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(0)}ms`;
  }
  return `${seconds.toFixed(2)}s`;
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Validation utilities
export const isValidSerialNumber = (serial: string): boolean => {
  return serial.trim().length > 0 && serial.trim().length <= 50;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Storage utilities for caching analytics data
export const getCachedData = (key: string): any | null => {
  try {
    const cached = sessionStorage.getItem(`analytics_${key}`);
    if (cached) {
      const data = JSON.parse(cached);
      // Check if data is less than 5 minutes old
      if (Date.now() - data.timestamp < 300000) {
        return data.value;
      }
      sessionStorage.removeItem(`analytics_${key}`);
    }
  } catch (error) {
    console.warn('Failed to get cached data:', error);
  }
  return null;
};

export const setCachedData = (key: string, value: any): void => {
  try {
    sessionStorage.setItem(`analytics_${key}`, JSON.stringify({
      value,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
};

// Device type mapping with icons and colors
export const DEVICE_TYPE_CONFIG = {
  'Smartphone': { icon: '📱', color: '#3B82F6' },
  'Laptop': { icon: '💻', color: '#10B981' },
  'Tablet': { icon: '📱', color: '#F59E0B' },
  'Desktop': { icon: '🖥️', color: '#EF4444' },
  'Monitor': { icon: '🖥️', color: '#8B5CF6' },
  'Camera': { icon: '📷', color: '#EC4899' },
  'Audio Device': { icon: '🎧', color: '#14B8A6' },
  'Gaming Console': { icon: '🎮', color: '#F97316' },
  'Smart Watch': { icon: '⌚', color: '#84CC16' },
  'Other': { icon: '📦', color: '#6366F1' }
};

// Notification utilities
// export const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
//   // This can be integrated with your notification system
//   // console.log(`${type.toUpperCase()}: ${message}`);
  
//   // You can integrate with toast libraries like react-hot-toast:
//   // import toast from 'react-hot-toast';
//   // toast[type](message);
// };

// Analytics event tracking (for user behavior analytics)
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // This can be integrated with analytics services like Google Analytics, Mixpanel, etc.
  console.log(`Analytics Event: ${eventName}`, properties);
  
  // Example integration:
  // gtag('event', eventName, properties);
  // mixpanel.track(eventName, properties);
};

// Export default config object
export default {
  API_BASE_URL,
  ANALYTICS_CONFIG,
  DEVICE_TYPE_CONFIG,
  getAuthToken,
  getCurrentUser,
  isAuthenticated,
  getUserRole,
  getHeaders,
  handleApiError,
  formatNumber,
  formatPercentage,
  formatDuration,
  formatDate,
  formatDateTime,
  isValidSerialNumber,
  isValidEmail,
  getCachedData,
  setCachedData,
  // showNotification,
  trackEvent
};