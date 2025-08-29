// components/dashboard/ProductRegistrationForm.tsx
import React, { useState } from 'react';
import type { ProductFormData } from '../../../types/dashboard';
import { X, Package } from 'lucide-react';

interface ProductRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading: boolean;
}

export const ProductRegistrationForm: React.FC<ProductRegistrationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    serial_number: '',
    brand: '',
    model: '',
    device_type: '',
    storage_data: '',
    color: '',
    batch_number: ''
  });

  const deviceTypes = [
    'Smartphone',
    'Laptop',
    'Tablet',
    'Desktop',
    'Monitor',
    'Camera',
    'Audio Device',
    'Gaming Console',
    'Smart Watch',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serial_number || !formData.brand || !formData.model || !formData.device_type) {
      alert('Please fill in all required fields');
      return;
    }

    await onSubmit(formData);
    
    // Reset form on success
    setFormData({
      serial_number: '',
      brand: '',
      model: '',
      device_type: '',
      storage_data: '',
      color: '',
      batch_number: ''
    });
  };

  const generateSerialNumber = () => {
    const prefix = 'TEST';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const serialNumber = `${prefix}${timestamp}${random}`;
    
    setFormData((prev: any) => ({ ...prev, serial_number: serialNumber }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50r p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Register New Product on Blockchain
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Serial Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number *
              </label>
              <div className="flex flex-col gap-y-1.5">
                <input
                  type="text"
                  value={formData.serial_number}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, serial_number: e.target.value }))}
                  placeholder="Enter unique serial number"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div>
                <button
                  type="button"
                  onClick={generateSerialNumber}
                  className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                  Generate Serial Number
                </button>
                  </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, brand: e.target.value }))}
                placeholder="Enter brand name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Model and Device Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, model: e.target.value }))}
                placeholder="Enter model name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Type *
              </label>
              <select
                value={formData.device_type}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, device_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select device type</option>
                {deviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Storage and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage/Specs
              </label>
              <input
                type="text"
                value={formData.storage_data}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, storage_data: e.target.value }))}
                placeholder="e.g., 256GB, 16GB RAM"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, color: e.target.value }))}
                placeholder="e.g., Black, Silver"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Batch Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Number
            </label>
            <input
              type="text"
              value={formData.batch_number}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, batch_number: e.target.value }))}
              placeholder="Will auto-generate if empty"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Register on Blockchain'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

