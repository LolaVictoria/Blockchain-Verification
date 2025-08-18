// Manufacturer Dashboard Components
import { useState } from 'react';
import { Plus } from 'lucide-react';
import apiClient from '../../utils/apiClient'; 
// import Product from '../../../types';

const RegisterProductForm: React.FC<{ onProductRegistered: () => void }> = ({ onProductRegistered }) => {
  const [formData, setFormData] = useState({
    serial_number: '',
    product_name: '',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
   
    try {
      await apiClient.request("/manufacturers", "POST", formData);
      
      
      setSuccess(true);
      setFormData({ serial_number: '', product_name: '', category: '', description: '' });
      setTimeout(() => {
        setSuccess(false);
        onProductRegistered();
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Plus size={20} className="mr-2 text-blue-600" />
        Register New Product
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serial Number
            </label>
            <input
              type="text"
              value={formData.serial_number}
              onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) => setFormData({...formData, product_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Automotive">Automotive</option>
            <option value="Medical">Medical</option>
            <option value="Consumer Goods">Consumer Goods</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>

        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
            Product registered successfully on blockchain!
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Registering on Blockchain...' : 'Register Product'}
        </button>
      </form>
    </div>
  );
};

export default RegisterProductForm;