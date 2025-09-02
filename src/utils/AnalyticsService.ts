import apiClient from './apiClient';

// Core interfaces
export interface VerificationTrend {
  date: string;
  successful: number;
  failed: number;
  responseTime: number;
  transactions: number;
  securityScore: number;
}

export interface KPIs {
  avgResponseTime: number;
  successfulVerifications: number;
  totalAttempts: number;
  transactionEfficiency: number;
  verificationAccuracy: number;
}

export interface VerificationTrendsResponse {
  kpis: KPIs;
  verificationTrends: VerificationTrend[];
}

export interface DeviceAnalytic {
  name: string;
  verifications: number;
  authentic: number;
  counterfeit: number;
  color?: string;
}

export interface CustomerEngagement {
  date: string;
  newCustomers: number;
  returningCustomers: number;
  totalVerifications: number;
  avgSatisfaction: number;
}

export interface CounterfeitLocation {
  location: string;
  reports: number;
  deviceType: string;
}

export interface CustomerVerificationHistory {
  date: string;
  verifications: number;
  authentic: number;
  counterfeit: number;
  avgTime: number;
}

export interface CustomerDeviceBreakdown {
  name: string;
  count: number;
  authentic: number;
  counterfeit: number;
  color: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Manufacturer Analytics Methods
  async getVerificationTrends(timeRange: string): Promise<VerificationTrendsResponse> {
    try {
      const response = await apiClient.get<VerificationTrendsResponse>(`/analytics/verifications?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch verification trends:', error);
      throw error;
    }
  }

  async getDeviceAnalytics(): Promise<DeviceAnalytic[]> {
    try {
      const response = await apiClient.get<DeviceAnalytic[]>('/analytics/devices');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch device analytics:', error);
      throw error;
    }
  }

  async getCustomerEngagement(timeRange: string): Promise<CustomerEngagement[]> {
    try {
      const response = await apiClient.get<CustomerEngagement[]>(`/analytics/customers?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer engagement:', error);
      throw error;
    }
  }

  async getCounterfeitLocations(): Promise<CounterfeitLocation[]> {
    try {
      const response = await apiClient.get<CounterfeitLocation[]>('/analytics/counterfeit-locations');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch counterfeit locations:', error);
      throw error;
    }
  }

  // Customer Analytics Methods
  async getCustomerVerificationHistory(timeRange: string): Promise<CustomerVerificationHistory[]> {
    try {
      const response = await apiClient.get<CustomerVerificationHistory[]>(`/analytics/customer/history?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer history:', error);
      throw error;
    }
  }

  async getCustomerDeviceBreakdown(): Promise<CustomerDeviceBreakdown[]> {
    try {
      const response = await apiClient.get<CustomerDeviceBreakdown[]>('/analytics/customer/devices');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer device breakdown:', error);
      throw error;
    }
  }

  // Utility Methods
  async reportCounterfeit(reportData: {
    serialNumber: string;
    productName: string;
    location: string;
    description?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/counterfeit-reports', reportData);
      return {
        success: true,
        message: response.data.message || 'Report submitted successfully'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to submit counterfeit report');
    }
  }
}

const analyticsService = AnalyticsService.getInstance();
export default analyticsService;