// hooks/useVerification.ts - Debug version
import { useState } from 'react';
import type { VerificationResult, BatchVerificationResult, SampleData, OwnershipRecord } from '../utils/VerificationService';

// Make sure your verificationService is properly exported
import { verificationService } from '../utils/VerificationService';

export const useVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const verifyProduct = async (serialNumber: string): Promise<VerificationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!verificationService.verifyProduct) {
        throw new Error('VerificationService.verifyProduct is not available');
      }

      const result = await verificationService.verifyProduct(serialNumber);
      return result;
    } catch (err) {
      console.error('Verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyBatch = async (serialNumbers: string[]): Promise<BatchVerificationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!verificationService.verifyBatch) {
        throw new Error('VerificationService.verifyBatch is not available');
      }

      const result = await verificationService.verifyBatch(serialNumbers);
      return result;
    } catch (err) {
      console.error('Batch verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = async (): Promise<SampleData> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!verificationService.loadSampleData) {
        throw new Error('verificationService.loadSampleData is not available');
      }

      const result = await verificationService.loadSampleData();
      return result;
    } catch (err) {
      console.error('Load sample data error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getOwnershipHistory = async (serialNumber: string): Promise<{ history: OwnershipRecord[] }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!verificationService.getOwnershipHistory) {
        throw new Error('verificationService.getOwnershipHistory is not available');
      }

      const result = await verificationService.getOwnershipHistory(serialNumber);
      return result;
    } catch (err) {
      console.error('Get ownership history error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    verifyProduct,
    verifyBatch,
    loadSampleData,
    getOwnershipHistory,
    clearError
  };
};