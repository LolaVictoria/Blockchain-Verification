// hooks/useAnalytics.ts
import { useState, useCallback, useEffect } from 'react';
import { analyticsService } from '../utils/AnalyticsService'; // Changed to named import
import type {
  VerificationTrend,
  KPIs,
  DeviceAnalytic,
  CustomerEngagement,
  CounterfeitLocation,
  CustomerVerificationHistory,
  CustomerDeviceBreakdown,
  SecurityMetric,
  ManufacturerOverview,
  CounterfeitReportData,
} from '../utils/AnalyticsService';

interface AnalyticsState {
  // Common state
  loading: boolean;
  error: string | null;
  
  // Manufacturer analytics
  verificationTrends: {
    verificationTrends: VerificationTrend[];
    kpis: KPIs;
  } | null;
  deviceAnalytics: DeviceAnalytic[];
  customerEngagement: CustomerEngagement[];
  counterfeitLocations: CounterfeitLocation[];
  securityMetrics: SecurityMetric[];
  overallSecurityScore: number;
  manufacturerOverview: {
    overview: ManufacturerOverview;
    topProducts: Array<{
      name: string;
      brand: string;
      model: string;
      verifications: number;
      authenticityRate: number;
    }>;
  } | null;
  
  // Customer analytics
  customerHistory: CustomerVerificationHistory[];
  customerDevices: CustomerDeviceBreakdown[];
  recentVerifications: Array<{
    serialNumber: string;
    product: string;
    status: string;
    date: string;
    time: string;
    confidence: number;
  }>;
  
  // Performance data
  performanceAlerts: Array<{
    type: string;
    title: string;
    message: string;
    severity: string;
  }>;
  realTimeStatus: {
    recentActivity: number;
    totalProducts: number;
    blockchainHealth: boolean;
    uptimePercentage: number;
    lastVerification: string | null;
    systemStatus: 'healthy' | 'degraded' | 'critical';
  } | null;
  
  // Additional states for better UX
  refreshing: boolean;
  lastUpdated: Date | null;
}

const initialState: AnalyticsState = {
  loading: false,
  error: null,
  verificationTrends: null,
  deviceAnalytics: [],
  customerEngagement: [],
  counterfeitLocations: [],
  securityMetrics: [],
  overallSecurityScore: 0,
  manufacturerOverview: null,
  customerHistory: [],
  customerDevices: [],
  recentVerifications: [],
  performanceAlerts: [],
  realTimeStatus: null,
  refreshing: false,
  lastUpdated: null,
};

// Generate colors for device breakdowns
const generateDeviceColors = (devices: any[]) => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#6366F1'
  ];
  
  return devices.map((device, index) => ({
    ...device,
    color: colors[index % colors.length]
  }));
};

export const useAnalytics = (timeRange: string = '30d') => {
  const [state, setState] = useState<AnalyticsState>(initialState);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setRefreshing = useCallback((refreshing: boolean) => {
    setState(prev => ({ ...prev, refreshing }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const updateLastUpdated = useCallback(() => {
    setState(prev => ({ ...prev, lastUpdated: new Date() }));
  }, []);

  // Manufacturer Analytics Functions
  const loadManufacturerAnalytics = useCallback(async (deviceType?: string) => {
    setLoading(true);
    setError(null);

    try {
      const [
        verificationData,
        deviceData,
        customerData,
        counterfeitData,
        securityData,
        overviewData,
        alertsData,
        realTimeData,
      ] = await Promise.allSettled([
        analyticsService.getVerificationAnalytics(timeRange, deviceType),
        analyticsService.getDeviceAnalytics(timeRange),
        analyticsService.getCustomerEngagement(timeRange),
        analyticsService.getCounterfeitLocations(timeRange),
        analyticsService.getSecurityMetrics(),
        analyticsService.getManufacturerOverview(),
        analyticsService.getPerformanceAlerts(),
        analyticsService.getRealTimeStatus(),
      ]);

      setState(prev => ({
        ...prev,
        verificationTrends: verificationData.status === 'fulfilled' ? verificationData.value : null,
        deviceAnalytics: deviceData.status === 'fulfilled' ? 
          generateDeviceColors(deviceData.value.deviceVerifications) : [],
        customerEngagement: customerData.status === 'fulfilled' ? customerData.value.customerEngagement : [],
        counterfeitLocations: counterfeitData.status === 'fulfilled' ? counterfeitData.value.counterfeitLocations : [],
        securityMetrics: securityData.status === 'fulfilled' ? securityData.value.securityMetrics : [],
        overallSecurityScore: securityData.status === 'fulfilled' ? securityData.value.overallSecurityScore : 0,
        manufacturerOverview: overviewData.status === 'fulfilled' ? overviewData.value : null,
        performanceAlerts: alertsData.status === 'fulfilled' ? alertsData.value.alerts : [],
        realTimeStatus: realTimeData.status === 'fulfilled' ? realTimeData.value.realTimeStatus : null,
      }));

      // Log any failures for debugging
      const failures = [
        verificationData, deviceData, customerData, counterfeitData,
        securityData, overviewData, alertsData, realTimeData
      ].filter(result => result.status === 'rejected');
      
      if (failures.length > 0) {
        console.warn('Some analytics requests failed:', failures.map(f => f.status === 'rejected' ? f.reason : null));
      }

      updateLastUpdated();
    } catch (error) {
      console.error('Error loading manufacturer analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [timeRange, setLoading, setError, updateLastUpdated]);

  // Customer Analytics Functions
  const loadCustomerAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await analyticsService.getCustomerPersonalAnalytics(timeRange);
      
      setState(prev => ({
        ...prev,
        customerHistory: data.customerHistory,
        customerDevices: generateDeviceColors(data.deviceBreakdown),
        recentVerifications: data.recentVerifications,
      }));

      updateLastUpdated();
    } catch (error) {
      console.error('Error loading customer analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load customer analytics');
    } finally {
      setLoading(false);
    }
  }, [timeRange, setLoading, setError, updateLastUpdated]);

  // Refresh current data without full loading state
  const refreshData = useCallback(async (userRole: 'manufacturer' | 'customer' | null) => {
    if (state.loading) return; // Prevent multiple simultaneous refreshes
    
    setRefreshing(true);
    setError(null);

    try {
      if (userRole === 'manufacturer') {
        await loadManufacturerAnalytics();
      } else if (userRole === 'customer') {
        await loadCustomerAnalytics();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [state.loading, loadManufacturerAnalytics, loadCustomerAnalytics, setRefreshing, setError]);

  // Counterfeit Reporting
  const submitCounterfeitReport = useCallback(async (reportData: CounterfeitReportData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyticsService.submitCounterfeitReport(reportData);
      
      // Optionally reload analytics data after submitting report
      if (result.success) {
        try {
          const counterfeitData = await analyticsService.getCounterfeitLocations(timeRange);
          setState(prev => ({
            ...prev,
            counterfeitLocations: counterfeitData.counterfeitLocations,
          }));
        } catch (reloadError) {
          console.warn('Failed to reload counterfeit data after report:', reloadError);
        }
      }

      return result;
    } catch (error) {
      console.error('Error submitting counterfeit report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit counterfeit report';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [timeRange, setLoading, setError]);

  // Record verification attempt (for analytics tracking)
  const recordVerification = useCallback(async (verificationData: {
    serialNumber: string;
    productId?: string;
    customerId?: string;
    isAuthentic: boolean;
    responseTime: number;
    source: 'blockchain' | 'database';
    confidenceScore?: number;
    verificationMethod?: 'qr_code' | 'nfc' | 'manual' | 'batch';
  }) => {
    try {
      // Get additional device info
      const deviceInfo = {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      };

      // Try to get location if available (with user permission)
      let location = undefined;
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { 
              timeout: 5000,
              enableHighAccuracy: false 
            });
          });
          
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (geoError) {
          // Geolocation failed or was denied - continue without it
          console.log('Geolocation not available:', geoError);
        }
      }

      await analyticsService.recordVerificationAttempt({
        ...verificationData,
        deviceInfo: {
          ...deviceInfo,
          location,
        },
      });

    } catch (error) {
      console.warn('Failed to record verification for analytics:', error);
      // Don't throw error here - this is just for analytics tracking
    }
  }, []);

  // Export functionality
  const exportData = useCallback(async (
    exportType: 'verifications' | 'customers' | 'reports',
    format: 'json' | 'csv' = 'json'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyticsService.exportAnalyticsData(exportType, format, timeRange);
      
      // Create and trigger download
      let dataToDownload: string;
      let mimeType: string;
      
      if (format === 'json') {
        dataToDownload = JSON.stringify(result.data, null, 2);
        mimeType = 'application/json';
      } else {
        // Handle CSV format - convert array to CSV string if needed
        if (Array.isArray(result.data)) {
          // Convert array of objects to CSV string
          if (result.data.length > 0) {
            const headers = Object.keys(result.data[0]).join(',');
            const rows = result.data.map(row => 
              Object.values(row).map(value => 
                typeof value === 'string' && value.includes(',') ? `"${value}"` : value
              ).join(',')
            );
            dataToDownload = [headers, ...rows].join('\n');
          } else {
            dataToDownload = '';
          }
        } else if (typeof result.data === 'string') {
          // Data is already a CSV string
          dataToDownload = result.data;
        } else {
          // Fallback: convert to JSON and then to CSV-like format
          dataToDownload = JSON.stringify(result.data, null, 2);
        }
        mimeType = 'text/csv';
      }
      
      const blob = new Blob([dataToDownload], { type: mimeType });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportType}_${timeRange}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return result;
    } catch (error) {
      console.error('Error exporting data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [timeRange, setLoading, setError]);

  // Get comparison analytics
  const getComparisonAnalytics = useCallback(async () => {
    try {
      return await analyticsService.getComparisonAnalytics(timeRange);
    } catch (error) {
      console.error('Error getting comparison analytics:', error);
      throw error;
    }
  }, [timeRange]);

  // Get analytics trends
  const getAnalyticsTrends = useCallback(async () => {
    try {
      return await analyticsService.getAnalyticsTrends(timeRange);
    } catch (error) {
      console.error('Error getting analytics trends:', error);
      throw error;
    }
  }, [timeRange]);

  // Health check
  const checkSystemHealth = useCallback(async () => {
    try {
      return await analyticsService.checkHealth();
    } catch (error) {
      console.error('System health check failed:', error);
      throw error;
    }
  }, []);

  // Auto-refresh functionality for real-time data
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Auto-refresh real-time status every 30 seconds
    const startAutoRefresh = () => {
      interval = setInterval(async () => {
        if (state.loading || state.refreshing) return; // Skip if already loading
        
        try {
          const realTimeData = await analyticsService.getRealTimeStatus();
          setState(prev => ({
            ...prev,
            realTimeStatus: realTimeData.realTimeStatus,
            lastUpdated: new Date(),
          }));
        } catch (error) {
          console.warn('Auto-refresh failed:', error);
        }
      }, 30000);
    };

    // Start auto-refresh if we have real-time data
    if (state.realTimeStatus) {
      startAutoRefresh();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.realTimeStatus, state.loading, state.refreshing]);

  // Clear data when component unmounts or timeRange changes
  useEffect(() => {
    return () => {
      setState(initialState);
    };
  }, [timeRange]);

  return {
    // State
    loading: state.loading,
    refreshing: state.refreshing,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Manufacturer data
    verificationTrends: state.verificationTrends,
    deviceAnalytics: state.deviceAnalytics,
    customerEngagement: state.customerEngagement,
    counterfeitLocations: state.counterfeitLocations,
    securityMetrics: state.securityMetrics,
    overallSecurityScore: state.overallSecurityScore,
    manufacturerOverview: state.manufacturerOverview,
    performanceAlerts: state.performanceAlerts,
    realTimeStatus: state.realTimeStatus,
    
    // Customer data
    customerHistory: state.customerHistory,
    customerDevices: state.customerDevices,
    recentVerifications: state.recentVerifications,
    
    // Actions
    loadManufacturerAnalytics,
    loadCustomerAnalytics,
    refreshData,
    submitCounterfeitReport,
    recordVerification,
    exportData,
    getComparisonAnalytics,
    getAnalyticsTrends,
    checkSystemHealth,
    setError,
    setLoading,
    
    // Utility methods
    clearError: () => setError(null),
    clearData: () => setState(initialState),
  };
};