import React from 'react';
import { X, Package2, ExternalLink, Calendar, User, Wallet, Hash, Tag, Palette, Archive } from 'lucide-react';
import type { Product } from '../../../types/dashboard';
import { CopyableText } from '../../utils/CopyToClipboard';

interface ProductDetailsOverlayProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailsOverlay: React.FC<ProductDetailsOverlayProps> = ({ product, onClose }) => {
  // const formatDate = (dateString: string) => {
   
  //    const date = new Date(dateString).toLocaleDateString();
  //    return date
                     
  // };

  // Get current owner from the most recent ownership history entry or wallet_address
  const getCurrentOwner = () => {
    if (product.ownership_history && product.ownership_history.length > 0) {
      return product.ownership_history[product.ownership_history.length - 1].new_owner;
    }
    return "No current owner"
  };

  // Calculate days since registration
  const getDaysOld = () => {
    try {
      if (!product.registered_at) return 0;
      const registeredDate = new Date(product.registered_at);
      if (isNaN(registeredDate.getTime())) return 0;
      
      const now = new Date();
      const diffTime = now.getTime() - registeredDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 ? diffDays : 0;
    } catch (error) {
      return 0;
    }
  };

  // Check if verified based on registration_type
  const isVerified = product.registration_type === 'blockchain_confirmed' || product.blockchain_verified;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`${label} copied to clipboard`);
    } catch (err) {
      console.error(`Failed to copy ${label}:`, err);
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg">
                <Package2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Product Details</h2>
                <p className="opacity-90">Complete product information and history</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2  rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Product Identity */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-600" />
                  Product Identity
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <p className="text-gray-900 font-medium">{product.name || product.product_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Brand</label>
                      <p className="text-gray-900">{product.brand}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Model</label>
                      <p className="text-gray-900">{product.model}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="text-gray-900">{product.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Device Type</label>
                      <p className="text-gray-900">{product.device_type}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Serial & Batch Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-green-600" />
                  Identification
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                    <div className="flex items-center space-x-2">
                      <CopyableText
                        text={product.serial_number}
                        className="text-xs bg-gray-200 px-2 py-1 rounded font-mono border border-transparent"
                        successMessage="Serial number copied to clipboard!" 
                      />
                    </div>
                  </div>
                  {product.batch_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                      <p className="text-gray-900 font-mono">{product.batch_number}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Details */}
              {(product.description || product.color || product.storage_data) && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-purple-600" />
                    Additional Details
                  </h3>
                  <div className="space-y-3">
                    {product.description && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <p className="text-gray-900">{product.description}</p>
                      </div>
                    )}
                    {product.color && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Color</label>
                        <p className="text-gray-900">{product.color}</p>
                      </div>
                    )}
                    {product.storage_data && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Storage</label>
                        <p className="text-gray-900">{product.storage_data}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Blockchain Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Archive className="w-5 h-5 mr-2 text-indigo-600" />
                  Blockchain Registration
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  {product.specification_hash && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specification Hash</label>
                      <div className="flex items-center space-x-2">
                        <CopyableText
                          text={product.specification_hash}
                          className="text-xs bg-gray-200 px-2 py-1 rounded font-mono border border-transparent"
                          successMessage="Specification hash copied to clipboard!" 
                        />
                      </div>
                    </div>
                  )}
                  {product.block_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Block Number</label>
                      <p className="text-gray-900 font-mono">{product.block_number}</p>
                    </div>
                  )}
                  {product.gas_used && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gas Used</label>
                        <p className="text-gray-900 font-mono">{product.gas_used}</p>
                      </div>
                      {product.gas_price && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Gas Price</label>
                          <p className="text-gray-900 font-mono">{product.gas_price}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Manufacturer Info - COMMENTED OUT AS REQUESTED */}
              {/* <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-orange-600" />
                  Manufacturer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer ID</label>
                    <p className="text-gray-900 font-mono text-sm">{product.manufacturer_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer Address</label>
                    <p className="text-gray-900">{product.manufacturer_address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer Wallet</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900 font-mono text-sm break-all">{product.manufacturer_wallet}</p>
                      <button
                        onClick={() => copyToClipboard(product.manufacturer_wallet, 'Manufacturer wallet')}
                        className="text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        title="Copy manufacturer wallet"
                      >
                        <Wallet className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Ownership Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-600" />
                  Current Ownership
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Owner:</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900 font-mono text-sm break-all">{getCurrentOwner()}</p>
                      <button
                        onClick={() => copyToClipboard(getCurrentOwner(), 'Current owner address')}
                        className="text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        title="Copy owner address"
                      >
                        <Wallet className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registered At</label>
                    <p className="text-gray-900">{new Date(product.registered_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-gray-900">{new Date(product.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ownership History */}
          {product.ownership_history && product.ownership_history.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Archive className="w-5 h-5 mr-2 text-gray-600" />
                Ownership History
              </h3>
              <div className="space-y-3">
                {product.ownership_history.map((entry, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Transfer #{product.ownership_history.length - index}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.transfer_date).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs font-medium text-gray-600">From</label>
                        <p className="font-mono text-gray-900 break-all">{entry.previous_owner}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">To</label>
                        <p className="font-mono text-gray-900 break-all">{entry.new_owner}</p>
                      </div>
                      {entry.transaction_hash && (
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600">Transaction Hash</label>
                          <div className="flex items-center space-x-2">
                            <p className="font-mono text-gray-900 break-all text-sm">{entry.transaction_hash}</p>
                            <a
                              href={`https://sepolia.etherscan.io/tx/${entry.transaction_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                              title="View on blockchain"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {product.ownership_history && product.ownership_history.length > 1 
                    ? product.ownership_history.length 
                    : 0}
                </div>
                <div className="text-sm text-gray-600">Transfers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {isVerified ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {getDaysOld()}
                </div>
                <div className="text-sm text-gray-600">Days Old</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {product.registration_type === 'blockchain_confirmed' ? 'On-Chain' : 'Pending'}
                </div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
          {product.transaction_hash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${product.transaction_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View on Blockchain
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};