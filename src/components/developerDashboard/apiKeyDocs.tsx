import { useState } from "react"; 
import { FileText, Copy } from "lucide-react";

const ApiDocumentation: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('verify');

  const endpoints = {
    verify: {
      method: 'POST',
      path: 'https://product-verification-blockchain.onrender.com/verification/verify-one/<serial_number>',
      description: 'Verify a single product',
      example: {
        "Authorization": "Bearer YOUR_API_KEY",      
        request: {
          serial_number: 'SN001'
        },
        response: {
          verified: true,
          product: {
            serial_number: 'SN001',
            product_name: 'Premium Widget',
            category: 'Electronics',
            manufacturer_address: '0x1234...5678',
            registered_at: '2024-01-15T10:30:00Z'
          }
        }
      }
    },
    bulk_verify: {
      method: 'POST',
      path: 'https://product-verification-blockchain.onrender.com/verification/verify-bulk',
      description: 'Verify multiple products in a single request and receive a summary of which products are verified or not.',
      example: {
        request: {
          serial_numbers: ['SN001', 'SN002', 'SN003']
        },
        response: [
          {
            "serial_number": "SN001",
            "verified": true,
            "product": {
              "product_name": "Premium Widget",
              "category": "Electronics",
              "manufacturer_address": "0x1234567890abcdef1234567890abcdef12345678",
              "registered_at": "2024-01-15T10:30:00Z",
              "description": "High-quality electronic widget for smart homes."
            }
          },
          {
            "serial_number": "SN002",
            "verified": false,
            "error": "Product not found"
          },
          {
            "serial_number": "SN003",
            "verified": true,
            "product": {
              "product_name": "Eco Bottle",
              "category": "Household",
              "manufacturer_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
              "registered_at": "2024-03-22T14:45:00Z",
              "description": "Reusable eco-friendly water bottle."
            }
          }
        ],
        "total_checked": 3,
        "verified_count": 2,
        "success_rate": "66.7%"
      }
              },
     
    batch_verify: {
      method: 'POST',
      path: 'https://product-verification-blockchain.onrender.com/verification/verify-batch',
      description: 'Verify multiple products at once and receive detailed results, including verification status, product information, and optional timing/performance metrics for each verification.',
      example: {
        request: {
          serial_numbers: ['SN001', 'SN002', 'SN003']
        },
        response: {
            results: [
              {
                "serial_number": "SN001",
                "verified": true,
                "product": {
                  "product_name": "Premium Widget",
                  "category": "Electronics",
                  "manufacturer_address": "0x1234567890abcdef1234567890abcdef12345678",
                  "registered_at": "2024-01-15T10:30:00Z",
                  "description": "High-quality electronic widget for smart homes."
                },
                "verification_time_ms": 12.34,
                "database_time_ms": 5.67
              },
              {
                "serial_number": "SN002",
                "verified": false,
                "error": "Product not found"
              },
              {
                "serial_number": "SN003",
                "verified": true,
                "product": {
                  "product_name": "Eco Bottle",
                  "category": "Household",
                  "manufacturer_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
                  "registered_at": "2024-03-22T14:45:00Z",
                  "description": "Reusable eco-friendly water bottle."
                },
                "verification_time_ms": 10.12,
                "database_time_ms": 4.56
              }
            ],
          "total_checked": 3,
          "verified_count": 2,
          "success_rate": "66.7%",
          "timing": {
            "total_time_ms": 50.12,
            "blockchain_time_ms": 22.46,
            "database_time_ms": 10.23,
            "average_per_product_ms": 16.71          
          }
  }
}
  }
}

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <FileText size={20} className="mr-2 text-indigo-600" />
        API Documentation
      </h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Authentication</h3>
        <p className="text-gray-600 mb-4">
          Include your API key in the Authorization header:
        </p>
        <div className="relative">
          <pre className="bg-gray-50 border rounded-lg p-4 text-sm overflow-x-auto">
            <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
          </pre>
          <button
            onClick={() => copyCode('Authorization: Bearer YOUR_API_KEY')}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Base URL</h3>
        <div className="relative">
          <pre className="bg-gray-50 border rounded-lg p-4 text-sm">
            <code>https://product-verification-blockchain.onrender.com</code>
          </pre>
          <button
            onClick={() => copyCode('https://product-verification-blockchain.onrender.com')}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Endpoints</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="flex border-b">
            {Object.entries(endpoints).map(([key, endpoint]) => (
              <button
                key={key}
                onClick={() => setSelectedEndpoint(key)}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedEndpoint === key
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                 {endpoint.description}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {(() => {
              const endpoint = endpoints[selectedEndpoint as keyof typeof endpoints];
              return (
                <div>
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      endpoint.method === 'POST' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <div className="relative">
                        <pre className="bg-gray-50 border rounded-lg px-1 py-4 text-sm w-auto">
                          {/* <code>{JSON.stringify(endpoint.example.request, null, 2)}</code> */}
                           <span className="ml-2 font-mono text-sm">{endpoint.path}</span>
                        </pre>
                        <button
                          onClick={() => copyCode(JSON.stringify(endpoint.example.request, null, 2))}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{endpoint.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Request Example</h4>
                      <div className="relative">
                        <pre className="bg-gray-50 border rounded-lg p-4 text-sm overflow-x-auto">
                          <code>{JSON.stringify(endpoint.example.request, null, 2)}</code>
                        </pre>
                        <button
                          onClick={() => copyCode(JSON.stringify(endpoint.example.request, null, 2))}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Response Example</h4>
                      <div className="relative">
                        <pre className="bg-gray-50 border rounded-lg p-4 text-sm overflow-x-auto">
                          <code>{JSON.stringify(endpoint.example.response, null, 2)}</code>
                        </pre>
                        <button
                          onClick={() => copyCode(JSON.stringify(endpoint.example.response, null, 2))}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">Rate Limits</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 1000 requests per hour for standard plans</li>
          <li>• 10000 requests per hour for premium plans</li>
          <li>• Batch operations count as 1 request per item</li>
        </ul>
      </div>
    </div>
  );
};
export default ApiDocumentation;