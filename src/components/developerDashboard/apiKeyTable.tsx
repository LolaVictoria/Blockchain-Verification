import React, { useEffect, useState } from 'react';
import type { ApiKey } from '../../../types/auth';
import InlineApiKeyDisplay from './apiKeyDisplay';

// Helper function - move outside components to avoid recreating
const formatDate = (dateString: any): string => {
  if (!dateString) return 'N/A';
  
  // Convert to string and trim whitespace
  const cleanDateString = String(dateString).trim();
  
  const date = new Date(cleanDateString);
  
  if (isNaN(date.getTime())) {
    return 'N/A';
  }
  
  return date.toLocaleDateString();
};

// Mobile card component for responsive design
const MobileApiKeyCard: React.FC<{ apiKey: ApiKey }> = ({ apiKey }) => {
  const [formattedCreatedDate, setFormattedCreatedDate] = useState<string>('N/A');
  const [formattedLastUsedDate, setFormattedLastUsedDate] = useState<string>('N/A');

  useEffect(() => {
    setFormattedCreatedDate(formatDate(apiKey.created_at));
    setFormattedLastUsedDate(apiKey.last_used ? formatDate(apiKey.last_used) : 'Never');
  }, [apiKey.created_at, apiKey.last_used]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{apiKey.label}</h3>
        <span className="text-sm text-gray-500">
          {apiKey.usage_count} requests
        </span>
      </div>
      
      <div className="mb-3">
        <InlineApiKeyDisplay apiKey={apiKey} />
      </div>
      
      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
        <div>
          <span className="font-medium">Created:</span>{' '}
          {formattedCreatedDate}
        </div>
        <div>
          <span className="font-medium">Last Used:</span>{' '}
          {formattedLastUsedDate}
        </div>
      </div>
    </div>
  );
};

// Main table component
const ApiKeysTable: React.FC<{ apiKeys: ApiKey[] }> = ({ apiKeys }) => {
  return (
    <>
      {/* Desktop Table View - hidden on mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Label
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                API Key
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Usage
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Created
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Last Used
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {apiKeys.map((apiKey, index) => (
              <tr key={apiKey._id?.toString() || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {apiKey.label}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 max-w-xs">
                  <InlineApiKeyDisplay apiKey={apiKey} />
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {apiKey.usage_count}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(apiKey.created_at)}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {apiKey.last_used ? formatDate(apiKey.last_used) : 'Never'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - visible on mobile only */}
      <div className="md:hidden space-y-4">
        {apiKeys.map((apiKey) => (
          <MobileApiKeyCard key={apiKey._id} apiKey={apiKey} />
        ))}
      </div>
      
      {apiKeys.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No API keys found.</p>
        </div>
      )}
    </>
  );
};

export default ApiKeysTable;