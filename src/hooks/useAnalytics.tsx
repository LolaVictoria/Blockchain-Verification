import { useState, useCallback } from 'react';
import analyticsService from '../utils/AnalyticsService';
import type {
  VerificationTrendsResponse,
  DeviceAnalytic,
  CustomerEngagement,
  CounterfeitLocation,
  CustomerVerificationHistory,
  CustomerDeviceBreakdown
} from '../utils/AnalyticsService';

export const useAnalytics = (timeRange: string = '30d') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Manufacturer data
  const [verificationTrends, setVerificationTrends] = useState<VerificationTrendsResponse | null>(null);
  const [deviceAnalytics, setDeviceAnalytics] = useState<DeviceAnalytic[]>([]);
  const [customerEngagement, setCustomerEngagement] = useState<CustomerEngagement[]>([]);
  const [counterfeitLocations, setCounterfeitLocations] = useState<CounterfeitLocation[]>([]);
  
  // Customer data
  const [customerHistory, setCustomerHistory] = useState<CustomerVerificationHistory[]>([]);
  const [customerDevices, setCustomerDevices] = useState<CustomerDeviceBreakdown[]>([]);

  // Load manufacturer analytics
  const loadManufacturerAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [trends, devices, engagement, locations] = await Promise.all([
        analyticsService.getVerificationTrends(timeRange),
        analyticsService.getDeviceAnalytics(),
        analyticsService.getCustomerEngagement(timeRange),
        analyticsService.getCounterfeitLocations()
      ]);
      
      setVerificationTrends(trends);
      setDeviceAnalytics(devices);
      setCustomerEngagement(engagement);
      setCounterfeitLocations(locations);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Load customer analytics
  const loadCustomerAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [history, devices] = await Promise.all([
        analyticsService.getCustomerVerificationHistory(timeRange),
        analyticsService.getCustomerDeviceBreakdown()
      ]);
      
      setCustomerHistory(history);
      setCustomerDevices(devices);
    } catch (err: any) {
      setError(err.message || 'Failed to load customer analytics');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Report counterfeit
  const reportCounterfeit = useCallback(async (reportData: {
    serialNumber: string;
    productName: string;
    location: string;
    description?: string;
  }) => {
    try {
      return await analyticsService.reportCounterfeit(reportData);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to submit report');
    }
  }, []);

  return {
    // State
    loading,
    error,
    
    // Manufacturer data
    verificationTrends,
    deviceAnalytics,
    customerEngagement,
    counterfeitLocations,
    
    // Customer data
    customerHistory,
    customerDevices,
    
    // Actions
    loadManufacturerAnalytics,
    loadCustomerAnalytics,
    reportCounterfeit,
    setError
  };
};