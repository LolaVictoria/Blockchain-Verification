import { useState } from "react";
import { Plus, Copy } from "lucide-react";
import apiClient from "../../utils/apiClient";
const ApiKeyGenerator: React.FC<{ onKeyGenerated: () => void }> = ({ onKeyGenerated }) => {
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState('');

  // const handleGenerate = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
    
  //   try {
  //     const response = await graphqlClient.query(`
  //       mutation CreateApiKey($label: String!) {
  //         createApiKey(label: $label) {
  //           success
  //           apiKey {
  //             key
  //             masked_key
  //           }
  //         }
  //       }
  //     `, { label });
      
  //     if (response.data.createApiKey.success) {
  //       setNewKey(response.data.createApiKey.apiKey.key);
  //       setLabel('');
  //       onKeyGenerated();
  //     }
  //   } catch (error) {
  //     console.error('Error generating API key:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGenerate = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Assuming your backend REST route is something like: POST /apikeys
    const response = await apiClient.request("/developer/apikeys", "POST", { label });

    

      if (response.data.createApiKey.success) {
        setNewKey(response.data.createApiKey.apiKey.key);
        setLabel('');
       onKeyGenerated();
      }
  } catch (error) {
    console.error("Error generating API key:", error);
  } finally {
    setLoading(false);
  }
};

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newKey);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Plus size={20} className="mr-2 text-indigo-600" />
        Generate API Key
      </h2>
      
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Key Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Production API, Test Environment"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !label.trim()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate API Key'}
        </button>
      </form>

      {newKey && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">New API Key Generated</span>
            <button
              onClick={copyToClipboard}
              className="flex items-center text-green-600 hover:text-green-700 text-sm"
            >
              <Copy size={16} className="mr-1" />
              Copy
            </button>
          </div>
          <code className="block p-3 bg-white border rounded text-sm font-mono break-all">
            {newKey}
          </code>
          <p className="text-xs text-green-700 mt-2">
            Save this key securely. It won't be shown again.
          </p>
        </div>
      )}
    </div>
  );
};
export default ApiKeyGenerator;