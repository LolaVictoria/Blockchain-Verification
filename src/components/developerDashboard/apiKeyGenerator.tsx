import { useState } from "react";
import { Plus, Copy, CheckCircle, XCircle } from "lucide-react";
import apiClient from "../../utils/apiClient";

const ApiKeyGenerator: React.FC<{ onKeyGenerated: () => void }> = ({ onKeyGenerated }) => {
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setNewKey('');
    
    try {
      const response = await apiClient.request("/developer/create-apikey", "POST", { label });
      
       const responseData = response.data;
      
      if (response.status >= 200 && response.status < 300 && responseData.success) {
        setNewKey(responseData.data.api_key);
        setLabel('');
        setMessage({
          type: 'success',
          text: responseData.message || 'API key created successfully!'
        });
        
        setTimeout(() => onKeyGenerated(), 100);
      } else {
        // Handle API errors (400, 500, etc.)
        setMessage({
          type: 'error',
          text: responseData.message || responseData.error || 'Failed to create API key'
        });
      }
    } catch (error: any) {
      console.error("Error generating API key:", error);
      
      // Handle different error scenarios from your backend
      let errorMessage = 'An unexpected error occurred';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(newKey);
      setMessage({
        type: 'success',
        text: 'API key copied to clipboard!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to copy to clipboard'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Plus size={20} className="mr-2 text-indigo-600" />
        Generate API Key
      </h2>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} className="mr-2 text-green-600" />
          ) : (
            <XCircle size={20} className="mr-2 text-red-600" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

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
            minLength={3}
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            Label must be between 3 and 50 characters
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading || !label.trim()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate API Key'}
        </button>
      </form>

      {/* Display New API Key */}
      {newKey && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">New API Key Generated</span>
            <button
              onClick={copyToClipboard}
              className="flex items-center text-green-600 hover:text-green-700 text-sm hover:bg-green-100 px-2 py-1 rounded transition-colors"
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