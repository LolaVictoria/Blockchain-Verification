// components/dashboard/DashboardStats.tsx
import React from 'react';
import type { DashboardStats as StatsType } from '../../../types/dashboard';
import { Package, CheckCircle, Clock, Eye } from 'lucide-react';

interface DashboardStatsProps {
  stats: StatsType | null;
  loading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Products',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'On Blockchain',
      value: stats?.blockchain_products || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending',
      value: stats?.pending_products || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Verifications',
      value: stats?.total_verifications || 0,
      icon: Eye,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">{stat.title}</div>
              <div className={`text-3xl font-bold ${stat.textColor} mt-2`}>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <span>{stat.value.toLocaleString()}</span>
                )}
              </div>
            </div>
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};