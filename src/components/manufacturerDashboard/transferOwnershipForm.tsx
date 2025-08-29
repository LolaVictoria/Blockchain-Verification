import React, { useState, useEffect } from 'react';
import type { Product } from '../../../types/dashboard';
import type { TransferFormData } from '../../../types/dashboard'
import { X, ArrowRightLeft } from 'lucide-react';

interface TransferOwnershipFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransferFormData) => Promise<void>;
  isLoading: boolean;
  products: Product | null;
}

export const TransferOwnershipForm: React.FC<TransferOwnershipFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  products
}) => {
  const [formData, setFormData] = useState<TransferFormData>({
    serial_number: '',
    new_owner: '',
    previous_owner: '',
    transfer_reason: '',
    notes: ''
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const transferReasons = [
    'Sale',
    'Gift',
    'Warranty Replacement',
    'Return/Exchange',
    'Business Transfer',
    'Other'
  ];

  const validEthAddress = /^0x[a-fA-F0-9]{40}$/;

  //Update selected product info when serial number changes
  useEffect(() => {
    if (products) {
      setSelectedProduct(products);
    } else {
      setSelectedProduct(null);
    }
  }, [formData.serial_number, products]);

  // Get current owner from product data (which becomes the previous owner in transfer)
const getCurrentOwner = (product: Product): string => {
  // First, check if there's a current_owner field
  if (product.current_owner) {
    return product.current_owner;
  }
  
  // Then check ownership history for the most recent owner
  const ownershipHistory = product.ownership_history || [];
  if (ownershipHistory.length > 0) {
    const lastOwnership = ownershipHistory[ownershipHistory.length - 1];
    return lastOwnership.new_owner || lastOwnership.owner_address || '';
  }
  
  // If no ownership history, the manufacturer is the current owner
  return product.manufacturer_wallet || '';
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serial_number || !formData.new_owner || !formData.transfer_reason) {
      alert('Please fill in all required fields');
      return;
    }

    if (!validEthAddress.test(formData.new_owner)) {
      alert('Please enter a valid Ethereum address (42 characters starting with 0x)');
      return;
    }

    await onSubmit(formData);
    
    // Reset form on success
    setFormData({
      serial_number: '',
      new_owner: '',
      transfer_reason: '',
      notes: '',
      previous_owner: '',
    });
    setSelectedProduct(null);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      serial_number: '',
      new_owner: '',
      previous_owner: '',
      transfer_reason: '',
      notes: ''
    });
    setSelectedProduct(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ArrowRightLeft className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Transfer Product Ownership
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Selection */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product (Serial Number) *
            </label>
            <select
              value={formData.serial_number}
              onChange={(e) => setFormData(prev => ({ ...prev, serial_number: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Select product to transfer</option>
              {products.map(product => (
                <option key={product._id} value={product.serial_number}>
                  {product.serial_number} - {product.product_name || `${product.model}`}
                </option>
              ))}
            </select>
            {products.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                No blockchain-confirmed products available for transfer
              </p>
            )}
          </div> */}

          {/* Current Product Info (Auto-filled and disabled) */}
          {selectedProduct && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Product Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={selectedProduct.serial_number}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Owner
                  </label>
                  <input
                    type="text"
                    value={getCurrentOwner(selectedProduct) || 'No owner found'}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 text-xs font-mono"
                    title={getCurrentOwner(selectedProduct) || 'No owner found'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* New Owner Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">New Owner Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Owner Wallet Address *
              </label>
              <input
                type="text"
                value={formData.new_owner}
                onChange={(e) => setFormData(prev => ({ ...prev, new_owner: e.target.value }))}
                placeholder="0x..."
                pattern="^0x[a-fA-F0-9]{40}$"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Must be a valid Ethereum address (42 characters starting with 0x)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Owner Name (Optional)
              </label>
              <input
                type="text"
                value={formData.new_owner}
                onChange={(e) => setFormData(prev => ({ ...prev, new_owner: e.target.value }))}
                placeholder="Enter new owner's name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Transfer Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Transfer Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Reason *
                </label>
                <select
                  value={formData.transfer_reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, transferReason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select reason</option>
                  {transferReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes about this transfer..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Transfer Ownership'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};