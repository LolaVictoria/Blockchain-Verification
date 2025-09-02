// components/MetricCard.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  /** The title/label displayed above the metric value */
  title: string;
  /** The main metric value to display */
  value: string | number;
  /** Unit of measurement (e.g., '%', 's', '/100') */
  unit?: string;
  /** Lucide React icon component to display */
  icon: LucideIcon;
  /** Percentage change from previous period (positive or negative) */
  trend?: number;
  /** Color theme for the card ('blue', 'green', 'purple', 'orange', 'red') */
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  /** Optional formula explanation text */
  formula?: string;
  /** Optional description text */
  description?: string;
  /** Additional CSS classes */
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit = '', 
  icon: Icon, 
  trend, 
  color = 'blue', 
  formula, 
  description,
  className = ''
}) => {
  // Color mappings for different themes
  const colorClasses = {
    blue: {
      value: 'text-blue-600',
      icon: 'text-blue-500',
      trend: trend && trend > 0 ? 'text-green-600' : 'text-red-600'
    },
    green: {
      value: 'text-green-600',
      icon: 'text-green-500',
      trend: trend && trend > 0 ? 'text-green-600' : 'text-red-600'
    },
    purple: {
      value: 'text-purple-600',
      icon: 'text-purple-500',
      trend: trend && trend > 0 ? 'text-green-600' : 'text-red-600'
    },
    orange: {
      value: 'text-orange-600',
      icon: 'text-orange-500',
      trend: trend && trend > 0 ? 'text-green-600' : 'text-red-600'
    },
    red: {
      value: 'text-red-600',
      icon: 'text-red-500',
      trend: trend && trend > 0 ? 'text-green-600' : 'text-red-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${colors.value}`}>
            {value}<span className="text-lg">{unit}</span>
          </p>
          
          {/* Trend indicator */}
          {trend !== undefined && (
            <p className={`text-sm mt-2 flex items-center ${colors.trend}`}>
              <span className="mr-1">
                {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
              </span>
              {Math.abs(trend)}% vs last period
            </p>
          )}
          
          {/* Description */}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
          
          {/* Formula explanation */}
          {formula && (
            <p className="text-xs text-gray-500 mt-1 italic">{formula}</p>
          )}
        </div>
        
        {/* Icon */}
        <Icon className={`h-12 w-12 ${colors.icon} flex-shrink-0`} />
      </div>
    </div>
  );
};

export default MetricCard;