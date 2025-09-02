import React, { useState, useEffect } from 'react';
import type { Product, FilterType } from '../../../types/dashboard';
import { ProductCard } from './productCard';
import { ArrowLeft, Package2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductDetailsOverlay } from './productDetailsOverlay';
import type { OwnershipRecord } from '../../../types/verification';
import { OwnershipHistoryModal } from './ownershipTransferHistory';
import { useVerification } from '../../hooks/useVerification';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuthContext } from '../../../context/AuthContext';
import { TransferOwnershipForm } from './transferOwnershipForm';
import { useAlert } from '../../hooks/useAlert';
import { useTransactionModal } from '../../hooks/useTransactionalModal';
import { useWeb3 } from '../../hooks/useWeb3';

export const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const { role, id } = useParams();
  const { user } = useAuthContext();
  
  // Local state for UI interactions
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductForTransfer, setSelectedProductForTransfer] = useState<Product | null>(null);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [ownershipModal, setOwnershipModal] = useState({
    open: false,
    loading: false,
    history: [] as OwnershipRecord[],
    serialNumber: ''
  });

  // Global state hooks (these should be in context)
  const { 
    products, 
    loading: productsLoading, 
    filter, 
    setFilter,
    transferOwnership,
    refreshDashboard 
  } = useDashboard();
  
  const { getOwnershipHistory } = useVerification();
  const { showAlert } = useAlert();
  const {  showTransactionModal, updateTransactionStatus, hideTransactionModal } = useTransactionModal();
  const web3 = useWeb3();

  // Verify user access
  useEffect(() => {
    if (!user || user.role !== role || user.id !== id) {
      navigate('/');
    }
  }, [user, role, id, navigate]);

  const handleProductTransferClick = (product: Product) => {
    setSelectedProductForTransfer(product);
    setShowTransferForm(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleViewOwnershipHistory = async (product: Product) => {
    setOwnershipModal({
      open: true,
      loading: true,
      history: [],
      serialNumber: product.serial_number
    });

    try {
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

  const handleGoBack = () => {
    navigate(`/dashboard/${role}/${id}`);
  };

  // Handle ownership transfer
  const handleOwnershipTransfer = async (transferData: any) => {
    if (!web3.isConnected || !web3.account) {
      showAlert('Please connect your MetaMask wallet first!', 'error');
      return;
    }

    setFormLoading(true);
    showTransactionModal('Preparing ownership transfer...');

    try {
      updateTransactionStatus('Validating recipient address...');

      if (!web3.web3.utils.isAddress(transferData.newOwner)) {
        throw new Error('Invalid recipient address');
      }

      updateTransactionStatus('Checking device ownership...');

      const deviceInfo = await web3.contract.methods.getDeviceInfo(transferData.serialNumber).call();
      if (deviceInfo.currentOwner.toLowerCase() !== web3.account.toLowerCase()) {
        throw new Error('You do not own this device');
      }

      updateTransactionStatus('Preparing blockchain transaction...');

      const gasEstimate = await web3.contract.methods.transferOwnership(
        transferData.serialNumber,
        transferData.newOwner
      ).estimateGas({ from: web3.account });

      const gasPrice = web3.web3.utils.toWei('2', 'gwei');
      const gasLimit = Math.floor(gasEstimate * 1.2);

      updateTransactionStatus('Sending blockchain transaction...');

      const result = await web3.contract.methods.transferOwnership(
        transferData.serialNumber,
        transferData.newOwner
      ).send({
        from: web3.account,
        gas: gasLimit,
        gasPrice: gasPrice
      });

      updateTransactionStatus('Blockchain confirmed! Updating database...');

      const backendResponse = await transferOwnership({
        serial_number: transferData.serialNumber,
        previous_owner: transferData.previous_owner,
        new_owner: transferData.new_number,
        transfer_reason: transferData.transfer_reason,
        notes: transferData.notes
      });

      if (backendResponse?.success != true) {
        console.warn('Backend update failed, but blockchain transfer succeeded');
      }

      updateTransactionStatus(
        `<div style="color: #10b981; text-align: center;">
          <h4>🎉 Ownership Transferred Successfully!</h4>
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>Device:</strong> ${transferData.serialNumber}</p>
            <p><strong>New Owner:</strong> ${transferData.newOwner}</p>
            <p><strong>Transaction Hash:</strong> ${result.transactionHash}</p>
          </div>
          <p>The ownership has been transferred on the blockchain!</p>
        </div>`
      );

      await refreshDashboard();
      setShowTransferForm(false);
      showAlert('Ownership transferred successfully!', 'success');

      setTimeout(() => {
        hideTransactionModal();
      }, 5000);

    } catch (error: any) {
      console.error('Ownership transfer error:', error);
      
      let errorMessage = 'Failed to transfer ownership';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user';
      }

      updateTransactionStatus(
        `<div style="color: #ef4444; text-align: center;">
          <h4>❌ Transfer Failed</h4>
          <p>${errorMessage}</p>
        </div>`
      );

      showAlert(errorMessage, 'error');

      setTimeout(() => {
        hideTransactionModal();
      }, 3000);
    } finally {
      setFormLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all' as FilterType, label: 'All Products' },
    { value: 'blockchain_confirmed' as FilterType, label: 'Blockchain Registered' },
    { value: 'blockchain_pending' as FilterType, label: 'Pending Registration' },
    { value: 'blockchain_failed' as FilterType, label: 'Failed Registration' }
  ];

  // Loading state
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="grid grid-cols-3 items-center p-6 border-b">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 text-center">My Registered Products</h1>
              <div></div>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Registered Products</h1>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {filterOptions.map((option, i) => (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
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
              {products.map((product, i) => (
                <ProductCard 
                  key={i} 
                  product={product} 
                  onTransferOwnership={handleProductTransferClick}
                  onViewDetails={handleViewDetails}
                  onViewOwnershipHistory={handleViewOwnershipHistory}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Overlay */}
      {selectedProduct && (
        <ProductDetailsOverlay
          product={selectedProduct}
          onClose={handleCloseDetails}
        />
      )}

      {/* Transfer Ownership Form Modal */}
      {showTransferForm && (
        <TransferOwnershipForm
          isOpen={showTransferForm}
          onSubmit={handleOwnershipTransfer}
          onClose={() => setShowTransferForm(false)}
          isLoading={formLoading}
          products={selectedProductForTransfer}
        />
      )}

      {/* Ownership History Modal */}
      <OwnershipHistoryModal
        isOpen={ownershipModal.open}
        onClose={() => setOwnershipModal(prev => ({ ...prev, open: false }))}
        serialNumber={ownershipModal.serialNumber}
        ownershipHistory={ownershipModal.history}
        loading={ownershipModal.loading}
        ownershipModal={ownershipModal}
      />
    </div>
  );
};