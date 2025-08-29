import
   apiClient 
  //  { type TypedApiResponse } 
   from '../utils/apiClient';

// Types for verification responses
export interface VerificationResult {
  authentic: boolean;
  serialNumber: string;
  brand?: string;
  model?: string;
  deviceType?: string;
  storage?: string;
  storageData?: string;
  color?: string;
  manufacturerName?: string;
  confidence?: number;
  blockchain_verified?: boolean;
  blockchain_proof?: {
    network?: string;
    contract_address?: string;
    explorer_links?: {
      transaction?: string;
      contract?: string;
    };
  };
  source?: 'blockchain' | 'database' | 'not_found';
  message?: string;
  verification_timestamp?: string;
  registered_at?: string;
  created_at?: string;
  ownership_history?: OwnershipRecord[];
}

export interface BatchVerificationResult {
  status: string;
  results: VerificationResult[];
  total_verified: number;
  total_checked: number;
}

export interface SampleData {
  authentic?: {
    blockchain?: string[];
    database?: string[];
  };
  counterfeit?: string[];
}

export interface OwnershipRecord {
  from?: string;
  to?: string;
  previous_owner?: string;
  new_owner?: string;
  transfer_date?: string;
  date?: string;
  transfer_reason?: string;
  reason?: string;
  transaction_hash?: string;
}

export interface VerificationStats {
  total_devices: number;
  blockchain_devices: number;
  total_verifications: number;
  authenticity_rate: number;
}

export interface OwnershipHistoryResponse {
  history: OwnershipRecord[];
  serialNumber: string;
}

class VerificationService {
  /**
   * Verify a single product by serial number
   */
  async verifyProduct(serialNumber: string): Promise<VerificationResult> {
    try {
      const response = await apiClient.get<VerificationResult>(
        `/verify/${encodeURIComponent(serialNumber)}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Verification error:', error);
      throw new Error(error.message || 'Failed to verify product');
    }
  }

  /**
   * Verify multiple products in batch
   */
  async verifyBatch(serialNumbers: string[]): Promise<BatchVerificationResult> {
    try {
      if (serialNumbers.length === 0) {
        throw new Error('Please provide at least one serial number');
      }
      
      if (serialNumbers.length > 10) {
        throw new Error('Maximum 10 devices per batch');
      }

      const response = await apiClient.post<BatchVerificationResult>(
        '/verify-batch',
        { serialNumbers }
      );
      return response.data;
    } catch (error: any) {
      console.error('Batch verification error:', error);
      throw new Error(error.message || 'Failed to verify batch');
    }
  }

  /**
   * Get sample data for testing
   */
  async getSampleData(): Promise<SampleData> {
    try {
      const response = await apiClient.get<SampleData>('/sample-data');
      return response.data;
    } catch (error: any) {
      console.error('Sample data error:', error);
      throw new Error(error.message || 'Failed to load sample data');
    }
  }

  /**
   * Get verification statistics
   */
  async getStats(): Promise<VerificationStats> {
    try {
      const response = await apiClient.get<VerificationStats>('/stats');
      return response.data;
    } catch (error: any) {
      console.error('Stats error:', error);
      throw new Error(error.message || 'Failed to load statistics');
    }
  }

  /**
   * Get ownership history for a product
   */
  async getOwnershipHistory(serialNumber: string): Promise<OwnershipHistoryResponse> {
    try {
      const response = await apiClient.get<OwnershipHistoryResponse>(
        `/ownership-history/${encodeURIComponent(serialNumber)}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Ownership history error:', error);
      throw new Error(error.message || 'Failed to load ownership history');
    }
  }

  /**
   * Log verification attempt (optional analytics)
   */
  async logVerificationAttempt(data: {
    serial_number: string;
    authentic: boolean;
    timestamp: string;
    user_agent: string;
  }): Promise<void> {
    try {
      await apiClient.post('/log-verification', data);
    } catch (error: any) {
      // Don't throw error for logging failures
      console.warn('Verification logging failed:', error);
    }
  }
}

export const verificationService = new VerificationService();
export default verificationService;