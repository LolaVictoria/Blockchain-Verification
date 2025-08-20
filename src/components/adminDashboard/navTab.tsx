import React from 'react';
import { Clock, CheckCircle2, Activity } from 'lucide-react';
import { useAdminContext } from '../../../context/AdminContext';

const NavigationTabs: React.FC = () => {
  const { state, actions } = useAdminContext();
  const { activeTab, pendingManufacturers, authorizedManufacturers, auditLogs } = state;

  const tabs = [
    {
      id: 'pending' as const,
      label: `Pending Manufacturers (${pendingManufacturers.length})`,
      icon: Clock
    },
    {
      id: 'authorized' as const,
      label: `Authorized Manufacturers (${authorizedManufacturers.length})`,
      icon: CheckCircle2
    },
    {
      id: 'audit' as const,
      label: `Audit Logs (${auditLogs.length})`,
      icon: Activity
    }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => actions.setActiveTab(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} className="inline mr-2" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NavigationTabs;