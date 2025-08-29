// hooks/useAlert.ts

import { useCallback, useState } from "react";

interface AlertState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    isVisible: false,
    message: '',
    type: 'info'
  });

  const showAlert = useCallback((message: string, type: AlertState['type'] = 'info') => {
    setAlert({
      isVisible: true,
      message,
      type
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    alert,
    showAlert,
    hideAlert
  };
};