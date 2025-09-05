// utils/AnalyticsService.ts - Updated to use apiClient
import apiClient from './apiClient';
import { getCurrentUser, getUserRole } from '../../config';

// Type definitions from your backend
export interface VerificationTrend {
  date: string;
  successful: number;
  failed: number;
  responseTime: number;
  transactions: number;
  totalAttempts: number;
  securityScore?: number;
}

export interface KPIs {
  verificationAccuracy: number;
  avgResponseTime: number;
  transactionEfficiency: number;
  totalAttempts: number;
  successfulVerifications: number;
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
  color: string;
}

export interface SecurityMetric {
  name: string;
  score: number;
}

export interface ManufacturerOverview {
  totalProducts: number;
  totalVerifications: number;
  counterfeitRate: number;
  activeCustomers: number;
}

export interface CounterfeitReportData {
  serialNumber: string;
  productName?: string;
  customerConsent: boolean;
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
  // Manufacturer Analytics
  async getVerificationAnalytics(timeRange: string, deviceType?: string): Promise<{
    verificationTrends: VerificationTrend[];
    kpis: KPIs;
  }> {
    try {
      const params = new URLSearchParams({
        timeRange,
        ...(deviceType && deviceType !== 'all' && { deviceType }),
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        verificationTrends: VerificationTrend[];
        kpis: KPIs;
      }>(`/analytics/verifications?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get verification analytics:', error);
      throw this.handleError(error);
    }
  }

  async getDeviceAnalytics(timeRange: string): Promise<{
    deviceVerifications: DeviceAnalytic[];
  }> {
    try {
      const params = new URLSearchParams({
        timeRange,
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        deviceVerifications: DeviceAnalytic[];
      }>(`/analytics/devices?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get device analytics:', error);
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
      }>(`/analytics/customers?${params}`);

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
      }>(`/analytics/counterfeit-locations?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get counterfeit locations:', error);
      throw this.handleError(error);
    }
  }

  async getSecurityMetrics(): Promise<{
    securityMetrics: SecurityMetric[];
    overallSecurityScore: number;
  }> {
    try {
      const params = new URLSearchParams({
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        securityMetrics: SecurityMetric[];
        overallSecurityScore: number;
      }>(`/analytics/security-metrics?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      throw this.handleError(error);
    }
  }

  async getManufacturerOverview(): Promise<{
    overview: ManufacturerOverview;
    topProducts: Array<{
      name: string;
      brand: string;
      model: string;
      verifications: number;
      authenticityRate: number;
    }>;
  }> {
    try {
      const params = new URLSearchParams({
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        overview: ManufacturerOverview;
        topProducts: Array<{
          name: string;
          brand: string;
          model: string;
          verifications: number;
          authenticityRate: number;
        }>;
      }>(`/analytics/manufacturer-overview?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get manufacturer overview:', error);
      throw this.handleError(error);
    }
  }

  // Customer Analytics
  async getCustomerPersonalAnalytics(timeRange: string): Promise<{
    customerHistory: CustomerVerificationHistory[];
    deviceBreakdown: CustomerDeviceBreakdown[];
    recentVerifications: Array<{
      serialNumber: string;
      product: string;
      status: string;
      date: string;
      time: string;
      confidence: number;
    }>;
  }> {
    try {
      const customerId = this.getCustomerId();
      const params = new URLSearchParams({ timeRange });

      const response = await apiClient.get<{
        customerHistory: CustomerVerificationHistory[];
        deviceBreakdown: CustomerDeviceBreakdown[];
        recentVerifications: Array<{
          serialNumber: string;
          product: string;
          status: string;
          date: string;
          time: string;
          confidence: number;
        }>;
      }>(`/analytics/customer/${customerId}?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get customer analytics:', error);
      throw this.handleError(error);
    }
  }

  // Counterfeit Reporting
  async submitCounterfeitReport(reportData: CounterfeitReportData): Promise<{
    success: boolean;
    message: string;
    reportId: string;
  }> {
    try {
      const customerId = this.getCustomerId();
      const params = new URLSearchParams({ customerId });

      const response = await apiClient.post<{
        success: boolean;
        message: string;
        reportId: string;
      }>(`/counterfeit-reports?${params}`, reportData);

      return response.data;
    } catch (error) {
      console.error('Failed to submit counterfeit report:', error);
      throw this.handleError(error);
    }
  }

  // Performance and Trends
  async getAnalyticsTrends(timeRange: string): Promise<{
    hourlyTrends: Array<{
      hour: string;
      verifications: number;
      authentic: number;
      avgResponseTime: number;
    }>;
    geographicDistribution: Array<{
      location: string;
      verifications: number;
      authenticityRate: number;
    }>;
  }> {
    try {
      const params = new URLSearchParams({
        timeRange,
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        hourlyTrends: Array<{
          hour: string;
          verifications: number;
          authentic: number;
          avgResponseTime: number;
        }>;
        geographicDistribution: Array<{
          location: string;
          verifications: number;
          authenticityRate: number;
        }>;
      }>(`/analytics/trends?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get analytics trends:', error);
      throw this.handleError(error);
    }
  }

  async getPerformanceAlerts(): Promise<{
    alerts: Array<{
      type: string;
      title: string;
      message: string;
      severity: string;
    }>;
  }> {
    try {
      const params = new URLSearchParams({
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        alerts: Array<{
          type: string;
          title: string;
          message: string;
          severity: string;
        }>;
      }>(`/analytics/performance-alerts?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get performance alerts:', error);
      throw this.handleError(error);
    }
  }

  async getRealTimeStatus(): Promise<{
    realTimeStatus: {
      recentActivity: number;
      totalProducts: number;
      blockchainHealth: boolean;
      uptimePercentage: number;
      lastVerification: string | null;
      systemStatus: 'healthy' | 'degraded' | 'critical';
    };
  }> {
    try {
      const params = new URLSearchParams({
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        realTimeStatus: {
          recentActivity: number;
          totalProducts: number;
          blockchainHealth: boolean;
          uptimePercentage: number;
          lastVerification: string | null;
          systemStatus: 'healthy' | 'degraded' | 'critical';
        };
      }>(`/analytics/real-time-status?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get real-time status:', error);
      throw this.handleError(error);
    }
  }

  async getComparisonAnalytics(timeRange: string): Promise<{
    currentPeriod: {
      verifications: number;
      authenticityRate: number;
      avgResponseTime: number;
      activeCustomers: number;
      avgSatisfaction: number;
    };
    previousPeriod: {
      verifications: number;
      authenticityRate: number;
      avgResponseTime: number;
      activeCustomers: number;
      avgSatisfaction: number;
    };
    changes: {
      verifications: number;
      authenticityRate: number;
      avgResponseTime: number;
      activeCustomers: number;
      avgSatisfaction: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        timeRange,
        manufacturerId: this.getManufacturerId(),
      });

      const response = await apiClient.get<{
        currentPeriod: {
          verifications: number;
          authenticityRate: number;
          avgResponseTime: number;
          activeCustomers: number;
          avgSatisfaction: number;
        };
        previousPeriod: {
          verifications: number;
          authenticityRate: number;
          avgResponseTime: number;
          activeCustomers: number;
          avgSatisfaction: number;
        };
        changes: {
          verifications: number;
          authenticityRate: number;
          avgResponseTime: number;
          activeCustomers: number;
          avgSatisfaction: number;
        };
      }>(`/analytics/comparison?${params}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get comparison analytics:', error);
      throw this.handleError(error);
    }
  }

  // Export functionality
  async exportAnalyticsData(
    exportType: 'verifications' | 'customers' | 'reports', 
    format: 'json' | 'csv', 
    timeRange: string
  ): Promise<{
    success: boolean;
    data: any[];
    count: number;
    generated_at: string;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: any[];
        count: number;
        generated_at: string;
      }>('/analytics/export', {
        manufacturerId: this.getManufacturerId(),
        type: exportType,
        format,
        timeRange,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to export analytics data:', error);
      throw this.handleError(error);
    }
  }

  // Health check
  async checkHealth(): Promise<{
    status: string;
    database: string;
    collections: {
      verifications: number;
      products: number;
      users: number;
    };
    timestamp: string;
  }> {
    try {
      const response = await apiClient.get<{
        status: string;
        database: string;
        collections: {
          verifications: number;
          products: number;
          users: number;
        };
        timestamp: string;
      }>('/analytics/health');

      return response.data;
    } catch (error) {
      console.error('Failed to check health:', error);
      throw this.handleError(error);
    }
  }

  // Record verification attempts (for analytics tracking)
  async recordVerificationAttempt(data: {
    serialNumber: string;
    productId?: string;
    customerId?: string;
    isAuthentic: boolean;
    responseTime: number;
    source: 'blockchain' | 'database';
    confidenceScore?: number;
    verificationMethod?: 'qr_code' | 'nfc' | 'manual' | 'batch';
    deviceInfo?: {
      userAgent: string;
      ipAddress?: string;
      location?: {
        latitude?: number;
        longitude?: number;
        country?: string;
        state?: string;
      };
    };
  }): Promise<{ success: boolean; verificationId: string }> {
    try {
      const response = await apiClient.post<{ 
        success: boolean; 
        verificationId: string 
      }>('/analytics/record-verification', {
        ...data,
        createdAt: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to record verification attempt:', error);
      // Don't throw error for analytics recording failures
      return { success: false, verificationId: '' };
    }
  }

  // Helper methods using your config utilities
  private getManufacturerId(): string {
    const user = getCurrentUser();
    const role = getUserRole();
    
    if (role === 'manufacturer' && user) {
      return user.id || user._id || '';
    }
    throw new Error('User is not a manufacturer');
  }

  private getCustomerId(): string {
    const user = getCurrentUser();
    const role = getUserRole();
    
    if (role === 'customer' && user) {
      return user.id || user._id || '';
    }
    throw new Error('User is not a customer');
  }

  private handleError(error: any): Error {
    if (error.message) {
      return new Error(error.message);
    }
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error('An unexpected error occurred');
  }
}

export const analyticsService = new AnalyticsService();
export default AnalyticsService;