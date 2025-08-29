// hooks/useTransactionModal.ts

import { useCallback, useState } from "react";

interface TransactionState {
  isVisible: boolean;
  message: string;
  type: 'loading' | 'success' | 'error';
}

export const useTransactionModal = () => {
  const [transaction, setTransaction] = useState<TransactionState>({
    isVisible: false,
    message: '',
    type: 'loading'
  });

  const showTransactionModal = useCallback((message: string, type: TransactionState['type'] = 'loading') => {
    setTransaction({
      isVisible: true,
      message,
      type
    });
  }, []);

  const updateTransactionStatus = useCallback((message: string, type: TransactionState['type'] = 'loading') => {
    setTransaction(prev => ({
      ...prev,
      message,
      type
    }));
  }, []);

  const hideTransactionModal = useCallback(() => {
    setTransaction(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    transaction,
    showTransactionModal,
    updateTransactionStatus,
    hideTransactionModal
  };
};