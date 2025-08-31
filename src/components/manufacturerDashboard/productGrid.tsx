import React, { useState } from 'react';
import type { Product, FilterType } from '../../../types/dashboard';
import { ProductCard } from './productCard';
import { ArrowLeft, Package2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductDetailsOverlay } from './productDetailsOverlay';
import type {  OwnershipRecord } from '../../../types/verification';
import { OwnershipHistoryModal } from './ownershipTransferHistory';
import { useVerification } from '../../hooks/useVerification';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onTransferOwnership: (product: Product) => void;
  onProductDisplay: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  filter,
  onFilterChange,
  onTransferOwnership,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [ownershipModal, setOwnershipModal] = useState({
    open: false,
    loading: false,
    history: [] as OwnershipRecord[], // Changed from OwnershipHistoryEntry[] to OwnershipRecord[]
    serialNumber: ''
  });
  
  const {
    getOwnershipHistory,
  } = useVerification();

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  // Updated function to fetch ownership history using the API
  const handleViewOwnershipHistory = async (product: Product) => {
    // Open modal immediately with loading state
    setOwnershipModal({
      open: true,
      loading: true,
      history: [],
      serialNumber: product.serial_number
    });

    try {
      // Fetch ownership history from API
      const data = await getOwnershipHistory(product.serial_number);
      setOwnershipModal(prev => ({
        ...prev,
        history: data.history || [],
        loading: false
      }));
    } catch (err) {
      console.error('Ownership history error:', err);
      setOwnershipModal(prev => ({
        ...prev,
        history: [],
        loading: false
      }));
    }
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  // Remove this function as it's now handled in handleViewOwnershipHistory
  // const showOwnershipHistory = async (serial: string) => {
  //   ...
  // };

  const navigate = useNavigate();

  const filterOptions = [
    { value: 'all' as FilterType, label: 'All Products' },
    { value: 'blockchain_confirmed' as FilterType, label: 'Blockchain Registered' },
    { value: 'blockchain_pending' as FilterType, label: 'Pending Registration' },
    { value: 'blockchain_failed' as FilterType, label: 'Failed Registration' }
  ];
 
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white overflow-y-scroll z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="grid grid-cols-3 items-center p-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">My Registered Products</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                  <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 overflow-y-scroll z-50 p-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center p-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-semibold text-gray-900">My Registered Products</h3>
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value as FilterType)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {filterOptions.map((option, i) => (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You haven't registered any products yet." 
                : `No products match the selected filter: ${filterOptions.find(f => f.value === filter)?.label}`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onTransferOwnership={onTransferOwnership}
                onViewDetails={handleViewDetails}
                onViewOwnershipHistory={handleViewOwnershipHistory}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Details Overlay */}
      {selectedProduct && (
        <ProductDetailsOverlay
          product={selectedProduct}
          onClose={handleCloseDetails}
        />
      )}

      {/* Ownership History Modal */}
      <OwnershipHistoryModal
        isOpen={ownershipModal.open}
        onClose={() => setOwnershipModal(prev => ({ ...prev, open: false }))}
        serialNumber={ownershipModal.serialNumber}
        ownershipHistory={ownershipModal.history} // Pass the actual history data
        loading={ownershipModal.loading}
        ownershipModal={ownershipModal}
      />
    </div>
  );
};