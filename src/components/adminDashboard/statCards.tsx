import React from 'react';
import { Clock, CheckCircle2, Activity, Users } from 'lucide-react';
import { useAdminContext } from '../../../context/AdminContext';

const StatsCards: React.FC = () => {
  const { state } = useAdminContext();
  const { pendingManufacturers, authorizedManufacturers, auditLogs } = state;

  const stats = [
    {
      title: 'Pending',
      value: pendingManufacturers.length,
      icon: Clock,
      color: 'text-yellow-500'
    },
    {
      title: 'Authorized',
      value: authorizedManufacturers.length,
      icon: CheckCircle2,
      color: 'text-green-500'
    },
    {
      title: 'Total Actions',
      value: auditLogs.length,
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      title: 'Total Users',
      value: pendingManufacturers.length + authorizedManufacturers.length,
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <stat.icon className={stat.color} size={24} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;