// utils/VerificationService.ts - Updated to use apiClient with analytics integration
import apiClient from './apiClient';
import { getCurrentUser } from '../../config';
import { analyticsService } from './AnalyticsService';

export interface VerificationResult {
  serialNumber: string;
  authentic: boolean;
  source: 'blockchain' | 'database' | 'not_found';
  message: string;
  brand?: string;
  model?: string;
  deviceType?: string;
  storage?: string;
  storageData?: string;
  color?: string;
  manufacturerName?: string;
  blockchain_proof?: {
    network: string;
    explorer_links: {
      contract?: string;
      transaction?: string;
    };
  };
  confidence_score?: number;
  response_time?: number;
}

export interface BatchVerificationResult {
  total_checked: number;
  total_verified: number;
  results: VerificationResult[];
}

export interface SampleData {
  authentic?: {
    blockchain?: string[];
    database?: string[];
  };
  counterfeit?: string[];
}

export interface OwnershipRecord {
  owner: string;
  timestamp: string;
  transaction_hash?: string;
  transfer_type: 'manufacture' | 'sale' | 'transfer';
}

class VerificationService {
  async verifyProduct(serialNumber: string): Promise<VerificationResult> {
    const startTime = performance.now();
    
    try {
      const response = await apiClient.get<VerificationResult>(`/verify/${encodeURIComponent(serialNumber)}`);
      
      const endTime = performance.now();
      const responseTime = (endTime - startTime) / 1000;
      
      const result = {
        ...response.data,
        response_time: responseTime,
      };

      // Record this verification attempt for analytics
      this.recordVerificationForAnalytics({
        serialNumber,
        isAuthentic: result.authentic,
        responseTime,
        source: result.source === 'not_found' ? 'database' : result.source,
        confidenceScore: result.confidence_score,
        verificationMethod: 'manual',
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = (endTime - startTime) / 1000;

      // Record failed verification attempt
      this.recordVerificationForAnalytics({
        serialNumber,
        isAuthentic: false,
        responseTime,
        source: 'database',
        verificationMethod: 'manual',
      });

      console.error('Failed to verify product:', error);
      throw this.handleError(error);
    }
  }

  async verifyBatch(serialNumbers: string[]): Promise<BatchVerificationResult> {
    const startTime = performance.now();
    
    try {
      const response = await apiClient.post<BatchVerificationResult>('/verify/batch', {
        serial_numbers: serialNumbers
      });

      const endTime = performance.now();
      const totalResponseTime = (endTime - startTime) / 1000;
      const avgResponseTime = totalResponseTime / serialNumbers.length;

      const result = response.data;

      // Record batch verification attempts for analytics
      const recordPromises = result.results.map(verification => 
        this.recordVerificationForAnalytics({
          serialNumber: verification.serialNumber,
          isAuthentic: verification.authentic,
          responseTime: verification.response_time || avgResponseTime,
          source: verification.source === 'not_found' ? 'database' : verification.source,
          confidenceScore: verification.confidence_score,
          verificationMethod: 'batch',
        })
      );

      // Don't wait for analytics recording to complete
      Promise.allSettled(recordPromises);

      return result;
    } catch (error) {
      const endTime = performance.now();
      const totalResponseTime = (endTime - startTime) / 1000;
      const avgResponseTime = totalResponseTime / serialNumbers.length;

      // Record failed batch verification attempts
      const recordPromises = serialNumbers.map(serialNumber => 
        this.recordVerificationForAnalytics({
          serialNumber,
          isAuthentic: false,
          responseTime: avgResponseTime,
          source: 'database',
          verificationMethod: 'batch',
        })
      );

      // Don't wait for analytics recording to complete
      Promise.allSettled(recordPromises);

      console.error('Failed to verify batch:', error);
      throw this.handleError(error);
    }
  }

  async loadSampleData(): Promise<SampleData> {
    try {
      const response = await apiClient.get<SampleData>('/sample-data');
      return response.data;
    } catch (error) {
      console.error('Failed to load sample data:', error);
      throw this.handleError(error);
    }
  }

  async getOwnershipHistory(serialNumber: string): Promise<{
    history: OwnershipRecord[];
  }> {
    try {
      const response = await apiClient.get<{
        history: OwnershipRecord[];
      }>(`/ownership/${encodeURIComponent(serialNumber)}`);

      return response.data;
    } catch (error) {
      console.error('Failed to get ownership history:', error);
      throw this.handleError(error);
    }
  }

  // QR Code verification
  async verifyQRCode(qrData: string): Promise<VerificationResult> {
    const startTime = performance.now();
    
    try {
      const response = await apiClient.post<VerificationResult>('/verify/qr', {
        qr_data: qrData
      });

      const endTime = performance.now();
      const responseTime = (endTime - startTime) / 1000;

      const result = {
        ...response.data,
        response_time: responseTime,
      };

      // Record QR verification attempt
      this.recordVerificationForAnalytics({
        serialNumber: result.serialNumber,
        isAuthentic: result.authentic,
        responseTime,
        source: result.source === 'not_found' ? 'database' : result.source,
        confidenceScore: result.confidence_score,
        verificationMethod: 'qr_code',
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = (endTime - startTime) / 1000;

      // Record failed QR verification attempt
      this.recordVerificationForAnalytics({
        serialNumber: 'unknown',
        isAuthentic: false,
        responseTime,
        source: 'database',
        verificationMethod: 'qr_code',
      });

      console.error('Failed to verify QR code:', error);
      throw this.handleError(error);
    }
  }

  // NFC verification
  async verifyNFC(nfcData: string): Promise<VerificationResult> {
    const startTime = performance.now();
    
    try {
      const response = await apiClient.post<VerificationResult>('/verify/nfc', {
        nfc_data: nfcData
      });

      const endTime = performance.now();
      const responseTime = (endTime - startTime) / 1000;

      const result = {
        ...response.data,
        response_time: responseTime,
      };

      // Record NFC verification attempt
      this.recordVerificationForAnalytics({
        serialNumber: result.serialNumber,
        isAuthentic: result.authentic,
        responseTime,
        source: result.source === 'not_found' ? 'database' : result.source,
        confidenceScore: result.confidence_score,
        verificationMethod: 'nfc',
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = (endTime - startTime) / 1000;

      // Record failed NFC verification attempt
      this.recordVerificationForAnalytics({
        serialNumber: 'unknown',
        isAuthentic: false,
        responseTime,
        source: 'database',
        verificationMethod: 'nfc',
      });

      console.error('Failed to verify NFC:', error);
      throw this.handleError(error);
    }
  }

  // Image-based verification (if you implement computer vision)
  async verifyProductImage(imageFile: File, serialNumber?: string): Promise<VerificationResult> {
    const startTime = performance.now();
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      if (serialNumber) {
        formData.append('serialNumber', serialNumber);
      }

      // Note: For FormData, we need to use a different approach
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await apiClient.request<VerificationResult>(
        '/verify/image',
        'POST',
        formData as any,
        headers
      );

      const endTime = performance.now();
      const responseTime = (endTime - startTime) / 1000;

      const result = {
        ...response.data,
        response_time: responseTime,
      };

      // Record image verification attempt
      this.recordVerificationForAnalytics({
        serialNumber: result.serialNumber || serialNumber || 'unknown',
        isAuthentic: result.authentic,
        responseTime,
        source: result.source === 'not_found' ? 'database' : result.source,
        confidenceScore: result.confidence_score,
        verificationMethod: 'manual', // or create 'image' type
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = (endTime - startTime) / 1000;

      // Record failed image verification attempt
      this.recordVerificationForAnalytics({
        serialNumber: serialNumber || 'unknown',
        isAuthentic: false,
        responseTime,
        source: 'database',
        verificationMethod: 'manual',
      });

      console.error('Failed to verify product image:', error);
      throw this.handleError(error);
    }
  }

  // Bulk verification by uploading a CSV file
  async verifyBulkCSV(csvFile: File): Promise<{
    results: VerificationResult[];
    summary: {
      total: number;
      authentic: number;
      counterfeit: number;
      failed: number;
    };
  }> {
    const startTime = performance.now();
    
    try {
      const formData = new FormData();
      formData.append('csv', csvFile);

      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await apiClient.request<{
        results: VerificationResult[];
        summary: {
          total: number;
          authentic: number;
          counterfeit: number;
          failed: number;
        };
      }>(
        '/verify/bulk-csv',
        'POST',
        formData as any,
        headers
      );

      const endTime = performance.now();
      const totalResponseTime = (endTime - startTime) / 1000;
      const avgResponseTime = totalResponseTime / response.data.results.length;

      // Record bulk CSV verification attempts
      const recordPromises = response.data.results.map(verification => 
        this.recordVerificationForAnalytics({
          serialNumber: verification.serialNumber,
          isAuthentic: verification.authentic,
          responseTime: verification.response_time || avgResponseTime,
          source: verification.source === 'not_found' ? 'database' : verification.source,
          confidenceScore: verification.confidence_score,
          verificationMethod: 'batch',
        })
      );

      // Don't wait for analytics recording to complete
      Promise.allSettled(recordPromises);

      return response.data;
    } catch (error) {
      console.error('Failed to verify bulk CSV:', error);
      throw this.handleError(error);
    }
  }

  // Private helper methods
  private async recordVerificationForAnalytics(data: {
    serialNumber: string;
    isAuthentic: boolean;
    responseTime: number;
    source: 'blockchain' | 'database';
    confidenceScore?: number;
    verificationMethod: 'qr_code' | 'nfc' | 'manual' | 'batch';
  }) {
    try {
      const user = getCurrentUser();
      await analyticsService.recordVerificationAttempt({
        ...data,
        customerId: user?.id || user?._id,
      });
    } catch (analyticsError) {
      console.warn('Failed to record verification for analytics:', analyticsError);
      // Don't throw - analytics failures shouldn't break verification
    }
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
    if (error.status) {
      return new Error(`Request failed with status ${error.status}`);
    }
    return new Error('An unexpected error occurred');
  }
}

export const verificationService = new VerificationService();
export default VerificationService;