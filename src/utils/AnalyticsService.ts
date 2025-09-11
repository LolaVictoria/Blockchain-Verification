import apiClient from './apiClient';
import { getCurrentUser } from '../../config';


export interface VerificationTrend {
  date: string;
  totalAttempts: number;
  successful: number;
  counterfeit: number;
  responseTime: number;
}

export interface kpis {
  totalAttempts: number;
  successfulVerifications: number;
  totalCounterfeit: number;
  verificationAccuracy: number;
  counterfeitRate: number;
  avgResponseTime: number;
  transactionEfficiency: number;
}

export interface CustomerDeviceBreakdown {
  name: string;
  count: number;
  authentic: number;
  counterfeit: number;
  color?: string;
  deviceNames?: string[]; 
  total: number;
  COLORS: string[]
}

export interface ManufacturerDeviceAnalytic {
  name: string;
  verifications: number;
  authentic: number;
  counterfeit: number;
  color?: string;
  customerCount: number;
  authenticityRate: number;
  avgConfidence: number;
  recentVerifications: number;
}

export interface DetailedDeviceBreakdown {
  deviceName: string;
  deviceCategory: string;
  verifications: number;
  authentic: number;
  counterfeit: number;
  customerCount: number;
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
  activeCustomers: number;
  totalVerifications: number;
  avgSatisfaction: number;
}

export interface CounterfeitLocation {
  location: string;
  deviceType: string;
  reports: number;
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
  color?: string;
}

export interface VerificationLog {
  serialNumber: string;
  deviceName: string;
  deviceCategory: string;
  status: string;
  date: string;
  time: string;
  confidence: number;
  verificationMethod: string;
  customerId?: string; 
  counterfeitId?: string;  
}

export interface CounterfeitReport {
  reportId: string;
  serialNumber: string;
  productName: string;
  deviceCategory: string;
  location: string;
  storeName: string;
  storeAddress: string;
  purchaseDate: string;
  purchasePrice: number;
  reportDate: string;
  status: string;
  additionalNotes: string;
  customerId: string;  
  verificationId?: string; 
}

export interface CounterfeitReportData {
  serialNumber: string;
  productName?: string;
  customerConsent: boolean;
  deviceCategory: string;
  locationData?: {
    storeName?: string;
    storeAddress?: string;
    city?: string;
    state?: string;
    purchaseDate?: string;
    purchasePrice?: string;
    additionalNotes?: string;
  };
}

class AnalyticsService {
  private getManufacturerId(): string {
    const user = getCurrentUser();
    if (!user?.id) {
      throw new Error('Manufacturer ID not found');
    }
    return user.id;
  }

  private getCustomerId(): string {
    const user = getCurrentUser();
    if (!user?.id) {
      throw new Error('Customer ID not found');
    }
    return user.id;
  }

  private handleError(error: any): Error {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    return new Error('Analytics service error occurred');
  }

  // MANUFACTURER ANALYTICS
  
  async getManufacturerOverview(timeRange: string = '30d'): Promise<{ kpis: kpis }> {
    try {
      const params = new URLSearchParams({
        manufacturerId: this.getManufacturerId(),
        timeRange
      });

      const response = await apiClient.get<{ kpis: kpis }>(
        `/analytics/manufacturer/overview?${params}`
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get manufacturer overview:', error);
      throw this.handleError(error);
    }
  }

  async getVerificationTrends(timeRange: string): Promise<{
    verificationTrends: VerificationTrend[];
  }> {
    try {
      const params = new URLSearchParams({
        timeRange,
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        verificationTrends: VerificationTrend[];
      }>(`/analytics/manufacturer/verification-trends?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get verification trends:', error);
      throw this.handleError(error);
    }
  }

  async getCustomerEngagement(timeRange: string): Promise<{
    customerEngagement: CustomerEngagement[];
  }> {
    try {
      const params = new URLSearchParams({
        timeRange,
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        customerEngagement: CustomerEngagement[];
      }>(`/analytics/manufacturer/customer-engagement?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get customer engagement:', error);
      throw this.handleError(error);
    }
  }

  async getCounterfeitLocations(timeRange: string): Promise<{
    counterfeitLocations: CounterfeitLocation[];
  }> {
    try {
      const params = new URLSearchParams({
        timeRange,
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        counterfeitLocations: CounterfeitLocation[];
      }>(`/analytics/manufacturer/counterfeit-locations?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get counterfeit locations:', error);
      throw this.handleError(error);
    }
  }
  
   async getManufacturerDeviceAnalytics(timeRange: string): Promise<{
    deviceVerifications: DeviceAnalytic[];
  }> {
    try {
      const params = new URLSearchParams({
        timeRange,
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        deviceVerifications: DeviceAnalytic[];
      }>(`/analytics/manufacturer/device-analytics?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get manufacturer device analytics:', error);
      throw this.handleError(error);
    }
  }

  async getManufacturerDetailedDeviceBreakdown(
    timeRange: string, 
    deviceCategory?: string
  ): Promise<{
    detailedBreakdown: DetailedDeviceBreakdown[];
  }> {
    try {
      const params = new URLSearchParams({
        timeRange,
        manufacturerId: this.getManufacturerId(),
      });
      
      if (deviceCategory) {
        params.append('deviceCategory', deviceCategory);
      }

      const response = await apiClient.get<{
        detailedBreakdown: DetailedDeviceBreakdown[];
      }>(`/analytics/manufacturer/detailed-device-breakdown?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get detailed device breakdown:', error);
      throw this.handleError(error);
    }
  }
  // CUSTOMER ANALYTICS

  async getCustomerOverview(timeRange: string): Promise<{
    customerHistory: CustomerVerificationHistory[];
  }> {
    try {
      const customerId = this.getCustomerId();
      const params = new URLSearchParams({ timeRange });

      const response = await apiClient.get<{
        customerHistory: CustomerVerificationHistory[];
      }>(`/analytics/customer/${customerId}/overview?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get customer overview:', error);
      throw this.handleError(error);
    }
  }

  async getCustomerDeviceBreakdown(timeRange: string): Promise<{
  deviceBreakdown: CustomerDeviceBreakdown[];
}> {
  try {
    const customerId = this.getCustomerId();
    const params = new URLSearchParams({ timeRange });

    const response = await apiClient.get<{
      deviceBreakdown: CustomerDeviceBreakdown[];
    }>(`/analytics/customer/${customerId}/device-breakdown?${params}`);

    return response.data;
  } catch (error) {
    console.error('Failed to get customer device breakdown:', error);
    throw this.handleError(error);
  }
}

  async getCustomerVerificationLogs(limit: number = 20): Promise<{
    verificationLogs: VerificationLog[];
  }> {
    try {
      const customerId = this.getCustomerId();
      const params = new URLSearchParams({ limit: limit.toString() });

      const response = await apiClient.get<{
        verificationLogs: VerificationLog[];
      }>(`/analytics/customer/${customerId}/verification-logs?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get customer verification logs:', error);
      throw this.handleError(error);
    }
  }

  async getCustomerCounterfeitReports(timeRange: string): Promise<{
    counterfeitReports: CounterfeitReport[];
  }> {
    try {
      const customerId = this.getCustomerId();
      const params = new URLSearchParams({ timeRange });

      const response = await apiClient.get<{
        counterfeitReports: CounterfeitReport[];
      }>(`/analytics/customer/${customerId}/counterfeit-reports?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get customer counterfeit reports:', error);
      throw this.handleError(error);
    }
  }

  
  async submitCounterfeitReport(reportData: CounterfeitReportData): Promise<{
    success: boolean;
    message: string;
    reportId?: string;
  }> {
    try {
      const customerId = this.getCustomerId();
      const params = new URLSearchParams({ customerId });

      // Enhanced payload that includes device information
      const enhancedReportData = {
        serialNumber: reportData.serialNumber,
        productName: reportData.productName || 'Unknown Product',
        deviceCategory: reportData.deviceCategory || 'Unknown Category',
        customerConsent: reportData.customerConsent,
        locationData: reportData.locationData
      };

      const response = await apiClient.post<{
        success: boolean;
        message: string;
        reportId?: string;
      }>(`/counterfeit-reports?${params}`, enhancedReportData);

      // If successful, the backend has updated the verification log with proper device info
      if (response.data.success) {
        console.log('Counterfeit report submitted and verification log updated with device info');
        
        // Optionally refresh verification logs to show updated device info
        try {
          // Trigger a refresh of verification logs if you have a way to do it
          // This could be through an event system or state management
          this.refreshVerificationLogs?.();
        } catch (refreshError) {
          console.warn('Failed to refresh verification logs:', refreshError);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Failed to submit counterfeit report:', error);
      throw this.handleError(error);
    }
  }
  // Optional: Add a method to refresh verification logs
  private refreshVerificationLogs?: () => void;

  // Method to set the refresh callback
  setVerificationLogsRefreshCallback(callback: () => void) {
    this.refreshVerificationLogs = callback;
  }



  async recordVerificationAttempt(verificationData: {
    serialNumber: string;
    customerId?: string;
    isAuthentic: boolean;
    responseTime: number;
    confidenceScore?: number;
    verificationMethod: string;
     deviceName?: string;    
    deviceCategory?: string;  
    brand?: string;         
    source?: 'blockchain' | 'database';
  }): Promise<{
    success: boolean;
    verificationId: string;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        verificationId: string;
      }>('/analytics/record-verification', verificationData);

      return response.data;
    } catch (error) {
      console.error('Failed to record verification attempt:', error);
      throw this.handleError(error);
    }
  }

  // UTILITY METHODS

  async exportAnalyticsData(type: 'manufacturer' | 'customer', timeRange: string): Promise<Blob> {
    try {
      const endpoint = type === 'manufacturer' 
        ? '/analytics/manufacturer/export' 
        : '/analytics/customer/export';
      
      const params = new URLSearchParams({ timeRange });
      if (type === 'manufacturer') {
        params.append('manufacturerId', this.getManufacturerId());
      } else {
        params.append('customerId', this.getCustomerId());
      }

      const response = await apiClient.get(`${endpoint}?${params}`, {
        responseType: 'blob'
      });

      return new Blob([response.data], { type: 'application/csv' });
    } catch (error) {
      console.error('Failed to export analytics data:', error);
      throw this.handleError(error);
    }
  }

  // VALIDATION HELPERS

  validateTimeRange(timeRange: string): boolean {
    const validRanges = ['7d', '30d', '90d', '1y'];
    return validRanges.includes(timeRange);
  }

  formatMetricValue(value: number, type: 'percentage' | 'currency' | 'number' | 'time'): string {
    switch (type) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'time':
        return `${value.toFixed(2)}s`;
      case 'number':
      default:
        return value.toLocaleString();
    }
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;