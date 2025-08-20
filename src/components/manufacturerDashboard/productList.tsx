import React, { useEffect, useState } from 'react';
import { Package, CheckCircle, XCircle } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import type { Product } from '../../../types'; 

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        const response = await apiClient.request("/manufaturer/my-products", "GET");
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
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
        <Package size={20} className="mr-2 text-blue-600" />
        Registered Products
      </h2>
      
      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No products registered yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-900">{product.product_name}</h3>
                  <span className="ml-3 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {product.category}
                  </span>
                </div>
                <div className="flex items-center">
                  {product.verified ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <CheckCircle size={16} className="mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-600 text-sm">
                      <XCircle size={16} className="mr-1" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Serial:</span> {product.serial_number}
                </div>
                <div>
                  <span className="font-medium">Registered:</span>{' '}
                  {new Date(product.registered_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Blockchain TX:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {product.blockchain_tx_hash.slice(0, 8)}...
                  </span>
                </div>
              </div>
              
              {product.description && (
                <p className="mt-3 text-sm text-gray-700">{product.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ProductList;
