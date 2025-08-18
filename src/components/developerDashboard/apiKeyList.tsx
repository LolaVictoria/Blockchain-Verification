import { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";
import type { ApiKey } from "../../../types";
import { Key } from "lucide-react";

const ApiKeyList: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiKeys = async () => {
  try {
    const response = await apiClient.request("/developers/apikeys", "GET");
    setApiKeys(response.data);
  } catch (error) {
    console.error("Error fetching API keys:", error);
  } finally {
    setLoading(false);
  }
};


    fetchApiKeys();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Key size={20} className="mr-2 text-indigo-600" />
        API Keys
      </h2>
      
      {apiKeys.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Key size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No API keys generated yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{apiKey.label}</h3>
                <span className="text-sm text-gray-500">
                  {apiKey.usage_count} requests
                </span>
              </div>
              
              <div className="mb-3">
                <code className="block p-2 bg-gray-50 border rounded text-sm font-mono">
                  {apiKey.masked_key}
                </code>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(apiKey.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Last Used:</span>{' '}
                  {apiKey.last_used ? new Date(apiKey.last_used).toLocaleDateString() : 'Never'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ApiKeyList;