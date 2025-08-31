import { X, Loader, CheckCircle, XCircle } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: {
    message: string;
    type: 'loading' | 'success' | 'error';
  };
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  status
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (status.type) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return <Loader className="h-12 w-12 text-blue-500 animate-spin" />;
    }
  };

  const getBackgroundColor = () => {
    switch (status.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (status.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-white  flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Transaction Status
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className={`rounded-lg border p-6 ${getBackgroundColor()}`}>
            <div className="flex flex-col items-center text-center space-y-4">
              {getIcon()}
              <div 
                className={`${getTextColor()}`}
                dangerouslySetInnerHTML={{ __html: status.message }}
              />
              {status.type === 'success' && (
                <p className="text-sm text-gray-600">
                  This modal will close automatically in 15 seconds
                </p>
              )}
            </div>
          </div>
        </div>

        {status.type !== 'loading' && (
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// components/dashboard/AlertToast.tsx
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import {  AlertTriangle, Info } from 'lucide-react';

interface AlertToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const AlertToast: React.FC<AlertToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className={`${getStyles()} rounded-lg shadow-lg p-4 max-w-md flex items-center gap-3`}>
        {getIcon()}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// components/dashboard/QuickActions.tsx
import React from 'react';
import { Plus, Wallet } from 'lucide-react';
import { useWeb3 } from '../../hooks/useWeb3';

interface QuickActionsProps {
  setShowProductForm: Dispatch<SetStateAction<boolean>>
  // onShowTransferForm: (product: Product) => void
  // onRefreshDashboard: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  setShowProductForm
}) => {
  const { connectWallet, isConnected } = useWeb3();

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setShowProductForm(true)}
          className="flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Register Product</span>
        </button>

        {/* <button
          onClick={onShowTransferForm}
          className="flex items-center gap-3 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <ArrowRightLeft className="h-5 w-5" />
          <span className="font-medium">Transfer Ownership</span>
        </button> */}

        {/* <button
          onClick={onRefreshDashboard}
          className="flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          <span className="font-medium">Refresh Data</span>
        </button> */}

        <button
          onClick={handleConnectWallet}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isConnected
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <Wallet className="h-5 w-5" />
          <span className="font-medium">
            {isConnected ? 'Wallet Connected' : 'Connect MetaMask'}
          </span>
        </button>
      </div>
    </div>
  );
};