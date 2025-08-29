import { useState, useCallback } from 'react';
import verificationService, { 
  type VerificationResult, 
  type BatchVerificationResult, 
  type SampleData, 
  type VerificationStats,
  type OwnershipHistoryResponse 
} from '../utils/VerificationService';

interface UseVerificationReturn {
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  verifyProduct: (serialNumber: string) => Promise<VerificationResult>;
  verifyBatch: (serialNumbers: string[]) => Promise<BatchVerificationResult>;
  loadSampleData: () => Promise<SampleData>;
  loadStats: () => Promise<VerificationStats>;
  getOwnershipHistory: (serialNumber: string) => Promise<OwnershipHistoryResponse>;
  clearError: () => void;
}

/**
 * Hook for verification operations without context dependency
 * Useful for components that need verification but don't want context overhead
 */
export const useVerification = (): UseVerificationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const verifyProduct = useCallback(async (serialNumber: string): Promise<VerificationResult> => {
    if (!serialNumber.trim()) {
      const errorMsg = 'Please enter a serial number';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verificationService.verifyProduct(serialNumber);
      
      // Log verification attempt (non-blocking)
      verificationService.logVerificationAttempt({
        serial_number: serialNumber,
        authentic: result.authentic,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
      }).catch(err => console.warn('Logging failed:', err));
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to verify device';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyBatch = useCallback(async (serialNumbers: string[]): Promise<BatchVerificationResult> => {
    const cleanSerials = serialNumbers.map(s => s.trim()).filter(s => s);
    
    if (cleanSerials.length === 0) {
      const errorMsg = 'Please enter valid serial numbers';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    if (cleanSerials.length > 10) {
      const errorMsg = 'Maximum 10 devices per batch';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verificationService.verifyBatch(cleanSerials);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to verify batch';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSampleData = useCallback(async (): Promise<SampleData> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await verificationService.getSampleData();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load sample data';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStats = useCallback(async (): Promise<VerificationStats> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await verificationService.getStats();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load statistics';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOwnershipHistory = useCallback(async (serialNumber: string): Promise<OwnershipHistoryResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await verificationService.getOwnershipHistory(serialNumber);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load ownership history';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    verifyProduct,
    verifyBatch,
    loadSampleData,
    loadStats,
    getOwnershipHistory,
    clearError
  };
};