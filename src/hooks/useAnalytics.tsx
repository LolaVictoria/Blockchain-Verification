import { useState, useCallback, useEffect } from 'react';
import analyticsService  from '../utils/AnalyticsService';
import type {
  VerificationTrend,
  kpis,
  DeviceAnalytic,
  CustomerEngagement,
  CounterfeitLocation,
  CustomerVerificationHistory,
  CustomerDeviceBreakdown,
  VerificationLog,
  CounterfeitReport,
  CounterfeitReportData,
  ManufacturerDeviceAnalytic
} from '../utils/AnalyticsService';

interface ManufacturerAnalyticsState {
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Manufacturer data
  kpis: kpis | null;
  verificationTrends: VerificationTrend[];
  deviceAnalytics: DeviceAnalytic[]; 
  customerEngagement: CustomerEngagement[];
  counterfeitLocations: CounterfeitLocation[];
  manufacturerDeviceAnalytics: ManufacturerDeviceAnalytic[]; 
}

interface CustomerAnalyticsState {
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Customer data
  customerHistory: CustomerVerificationHistory[];
  customerDevices: CustomerDeviceBreakdown[];
  verificationLogs: VerificationLog[];
  counterfeitReports: CounterfeitReport[];
}

const initialManufacturerState: ManufacturerAnalyticsState = {
  loading: false,
  error: null,
  lastUpdated: null,
  kpis: null,
  verificationTrends: [],
  deviceAnalytics: [],
  customerEngagement: [],
  counterfeitLocations: [],
  manufacturerDeviceAnalytics:[]
};

const initialCustomerState: CustomerAnalyticsState = {
  loading: false,
  error: null,
  lastUpdated: null,
  customerHistory: [],
  customerDevices: [],
  verificationLogs: [],
  counterfeitReports: [],
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

export const useManufacturerAnalytics = (timeRange: string = '30d') => {
  const [state, setState] = useState<ManufacturerAnalyticsState>(initialManufacturerState);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const loadManufacturerAnalytics = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const [
      overviewData,
      trendsData,
      manufacturerDeviceData, 
      engagementData,
      counterfeitData,
    ] = await Promise.allSettled([
      analyticsService.getManufacturerOverview(),
      analyticsService.getVerificationTrends(timeRange),
      analyticsService.getManufacturerDeviceAnalytics(timeRange), // New one
      analyticsService.getCustomerEngagement(timeRange),
      analyticsService.getCounterfeitLocations(timeRange),
    ]);

    setState(prev => ({
      ...prev,
      kpis: overviewData.status === 'fulfilled' ? overviewData.value.kpis : null,
      verificationTrends: trendsData.status === 'fulfilled' ? trendsData.value.verificationTrends : [],
      // deviceAnalytics: deviceData.status === 'fulfilled' ? 
      //   generateDeviceColors(deviceData.value.deviceVerifications || []) : [],
      manufacturerDeviceAnalytics: manufacturerDeviceData.status === 'fulfilled' ? 
        generateDeviceColors(manufacturerDeviceData.value.deviceVerifications || []) : [],
      customerEngagement: engagementData.status === 'fulfilled' ? engagementData.value.customerEngagement : [],
      counterfeitLocations: counterfeitData.status === 'fulfilled' ? counterfeitData.value.counterfeitLocations : [],
      lastUpdated: new Date(),
    }));

    // Log any failures for debugging
    const failures = [
      overviewData, trendsData, manufacturerDeviceData, engagementData, counterfeitData
    ].filter(result => result.status === 'rejected');
    
    if (failures.length > 0) {
      console.warn('Some manufacturer analytics requests failed:', 
        failures.map(f => f.status === 'rejected' ? f.reason : null));
    }

  } catch (error) {
    console.error('Error loading manufacturer analytics:', error);
    setError(error instanceof Error ? error.message : 'Failed to load analytics');
  } finally {
    setLoading(false);
  }
}, [timeRange, setLoading, setError]);

  
  useEffect(() => {
    loadManufacturerAnalytics();
  }, [loadManufacturerAnalytics]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Data
    kpis: state.kpis,
    verificationTrends: state.verificationTrends,
    deviceAnalytics: state.deviceAnalytics, 
    manufacturerDeviceAnalytics: state.manufacturerDeviceAnalytics, 
    customerEngagement: state.customerEngagement,
    counterfeitLocations: state.counterfeitLocations,
    
    // Actions
    loadManufacturerAnalytics,
    setError,
    clearError: () => setError(null),
  };
};

export const useCustomerAnalytics = (timeRange: string = '30d') => {
  const [state, setState] = useState<CustomerAnalyticsState>(initialCustomerState);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const loadCustomerAnalytics = useCallback(async (logsLimit: number = 20) => {
    setLoading(true);
    setError(null);

    try {
      const [
        overviewData,
        deviceData,
        logsData,
        reportsData,
      ] = await Promise.allSettled([
        analyticsService.getCustomerOverview(timeRange),
        analyticsService.getCustomerDeviceBreakdown(timeRange),
        analyticsService.getCustomerVerificationLogs(logsLimit),
        analyticsService.getCustomerCounterfeitReports(timeRange),
      ]);

      setState(prev => ({
        ...prev,
        customerHistory: overviewData.status === 'fulfilled' ? overviewData.value.customerHistory : [],
        customerDevices: deviceData.status === 'fulfilled' ? 
          generateDeviceColors(deviceData.value.deviceBreakdown) : [],
        verificationLogs: logsData.status === 'fulfilled' ? logsData.value.verificationLogs : [],
        counterfeitReports: reportsData.status === 'fulfilled' ? reportsData.value.counterfeitReports : [],
        lastUpdated: new Date(),
      }));

      // Log any failures for debugging
      const failures = [overviewData, deviceData, logsData, reportsData]
        .filter(result => result.status === 'rejected');
      
      if (failures.length > 0) {
        console.warn('Some customer analytics requests failed:', 
          failures.map(f => f.status === 'rejected' ? f.reason : null));
      }

    } catch (error) {
      console.error('Error loading customer analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load customer analytics');
    } finally {
      setLoading(false);
    }
  }, [timeRange, setLoading, setError]);

  const submitCounterfeitReport = useCallback(async (reportData: CounterfeitReportData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyticsService.submitCounterfeitReport(reportData);
      
      // Reload counterfeit reports after successful submission
      if (result.success) {
        try {
          const reportsData = await analyticsService.getCustomerCounterfeitReports(timeRange);
          setState(prev => ({
            ...prev,
            counterfeitReports: reportsData.counterfeitReports,
            lastUpdated: new Date(),
          }));
        } catch (reloadError) {
          console.warn('Failed to reload counterfeit reports:', reloadError);
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

  // Load data when component mounts or timeRange changes
  useEffect(() => {
    loadCustomerAnalytics();
  }, [loadCustomerAnalytics]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Data
    customerHistory: state.customerHistory,
    customerDevices: state.customerDevices,
    verificationLogs: state.verificationLogs,
    counterfeitReports: state.counterfeitReports,
    
    // Actions
    loadCustomerAnalytics,
    submitCounterfeitReport,
    setError,
    clearError: () => setError(null),
  };
};

// Shared analytics utilities
export const useVerificationRecording = () => {
  const recordVerification = useCallback(async (verificationData: {
    serialNumber: string;
    customerId?: string;
    isAuthentic: boolean;
    responseTime: number;
    source: 'blockchain' | 'database';
    confidenceScore?: number;
    verificationMethod: string;
  }) => {
    try {
      await analyticsService.recordVerificationAttempt(verificationData);
    } catch (error) {
      console.warn('Failed to record verification for analytics:', error);
      // Don't throw error here - this is just for analytics tracking
    }
  }, []);

  return { recordVerification };
};