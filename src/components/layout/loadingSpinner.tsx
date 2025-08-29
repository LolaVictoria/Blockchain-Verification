import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading data...", 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'text-blue-600',
    medium: 'text-blue-600',
    large: 'text-blue-600'
  };

  const iconSizes = {
    small: 16,
    medium: 32,
    large: 48
  };

  const containerClasses = {
    small: 'p-4',
    medium: 'p-12',
    large: 'p-16'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className={`text-center ${containerClasses[size]}`}>
        <RefreshCw 
          className={`animate-spin mx-auto mb-4 ${sizeClasses[size]}`} 
          size={iconSizes[size]} 
        />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;