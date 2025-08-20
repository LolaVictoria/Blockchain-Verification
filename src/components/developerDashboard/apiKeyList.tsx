import { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";
import type { ApiKey } from "../../../types";
import { Key } from "lucide-react";
import ApiKeysTable from "./apiKeyTable";

const ApiKeyList: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiKeys = async () => {
      setLoading(true);
        try {
        // In your API call
          const response = await apiClient.request("/developer/my-apikeys?show_full_key=true", "GET");
          setApiKeys(response.data.data.api_keys || []);
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
      
      
        <ApiKeysTable apiKeys={apiKeys} />
          
      
    </div>
  );
};
export default ApiKeyList;