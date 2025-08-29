import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import verificationService, { 
  type VerificationResult, 
  type BatchVerificationResult, 
  type SampleData, 
  type VerificationStats,
  type OwnershipHistoryResponse 
} from '../src/utils/VerificationService';

interface VerificationContextType {
  // State
  isLoading: boolean;
  error: string | null;
  
  // Single verification
  verificationResult: VerificationResult | null;
  
  // Batch verification
  batchResults: BatchVerificationResult | null;
  
  // Sample data
  sampleData: SampleData | null;
  
  // Statistics
  stats: VerificationStats | null;
  
  // Actions
  verifyProduct: (serialNumber: string) => Promise<VerificationResult>;
  verifyBatch: (serialNumbers: string[]) => Promise<BatchVerificationResult>;
  loadSampleData: () => Promise<SampleData>;
  loadStats: () => Promise<VerificationStats>;
  getOwnershipHistory: (serialNumber: string) => Promise<OwnershipHistoryResponse>;
  clearResults: () => void;
  clearError: () => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

interface VerificationProviderProps {
  children: ReactNode;
}

export const VerificationProvider: React.FC<VerificationProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [batchResults, setBatchResults] = useState<BatchVerificationResult | null>(null);
  const [sampleData, setSampleData] = useState<SampleData | null>(null);
  const [stats, setStats] = useState<VerificationStats | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResults = useCallback(() => {
    setVerificationResult(null);
    setBatchResults(null);
    setError(null);
  }, []);

  const verifyProduct = useCallback(async (serialNumber: string): Promise<VerificationResult> => {
    if (!serialNumber.trim()) {
      const error = 'Please enter a serial number';
      setError(error);
      throw new Error(error);
    }

    setIsLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const result = await verificationService.verifyProduct(serialNumber);
      setVerificationResult(result);
      
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
      const error = 'Please enter valid serial numbers';
      setError(error);
      throw new Error(error);
    }

    if (cleanSerials.length > 10) {
      const error = 'Maximum 10 devices per batch';
      setError(error);
      throw new Error(error);
    }

    setIsLoading(true);
    setError(null);
    setBatchResults(null);

    try {
      const result = await verificationService.verifyBatch(cleanSerials);
      setBatchResults(result);
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
      setSampleData(data);
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
      setStats(data);
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
    try {
      return await verificationService.getOwnershipHistory(serialNumber);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load ownership history';
      throw new Error(errorMessage);
    }
  }, []);

  const value: VerificationContextType = {
    isLoading,
    error,
    verificationResult,
    batchResults,
    sampleData,
    stats,
    verifyProduct,
    verifyBatch,
    loadSampleData,
    loadStats,
    getOwnershipHistory,
    clearResults,
    clearError
  };

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};