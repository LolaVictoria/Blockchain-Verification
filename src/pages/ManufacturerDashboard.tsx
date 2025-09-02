// pages/ManufacturerDashboard.tsx
import React, { useState, useEffect } from 'react';
// import type { Product } from "../../types/dashboard"
import { useWeb3 } from '../hooks/useWeb3';
import { useDashboard } from '../hooks/useDashboard';
import { useAlert } from '../hooks/useAlert';
import { useTransactionModal } from '../hooks/useTransactionalModal';
import { ConnectionStatus } from '../components/manufacturerDashboard/connectionStatus';
import { DashboardStats } from '../components/manufacturerDashboard/dashboardStats';
import { ProductRegistrationForm } from '../components/manufacturerDashboard/productRegistrationForm';
// import { TransferOwnershipForm } from '../components/manufacturerDashboard/transferOwnershipForm';
import { QuickActions } from '../components/manufacturerDashboard/modalComponents';
// import { AlertToast } from '../components/manufacturerDashboard/modalComponents';
import { DashboardNavbar } from '../components/manufacturerDashboard/mdNavbar';
import EditProfile from '../components/manufacturerDashboard/editProfile';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// import ManufacturerAnalyticsDashboard from '../components/analytics/manufacturerAnalytics';
import useAuth from '../hooks/useAuth';

const ManufacturerDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Form visibility states
  const [showProductForm, setShowProductForm] = useState(false);
  // const [showTransferForm, setShowTransferForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const {  refreshProfile, loading: profileLoading, error: profileError } = useAuthContext()
 const { user } = useAuth()
  const { 
    stats, 
    statsLoading, 
    registerProduct,
    // transferOwnership,
    refreshDashboard 
  } = useDashboard();  
  const { 
    // alert, 
    showAlert, 
    // hideAlert 
  } = useAlert();
  const { 
    // transaction, 
    showTransactionModal, updateTransactionStatus, hideTransactionModal } = useTransactionModal();
  const web3 = useWeb3();
  
  
  // Handle profile errors
  useEffect(() => {
    if (profileError) {
      showAlert(`Profile Error: ${profileError}`, 'error');
    }
  }, [profileError, showAlert]);

  // Handle role-based navigation
  useEffect(() => {
    if (user && user.role !== 'manufacturer') {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle product registration
  const handleProductSubmit = async (productData: any) => {
    if (!web3.isConnected || !web3.account) {
      showAlert('Please connect your MetaMask wallet first!', 'error');
      return;
    }

    setFormLoading(true);
    showTransactionModal('Preparing product registration...');

    try {
      // Generate specification hash
      const specString = `${productData.serial_number}${productData.brand}${productData.model}${productData.device_type}${productData.storage_data || ''}${productData.color || ''}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(specString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const specificationHash = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      updateTransactionStatus('Saving to database...');

      // Step 1: Save to backend database
      const backendResponse = await registerProduct(productData);
      
      if (!backendResponse?.success) {
        throw new Error(backendResponse?.message || 'Backend operation failed');
      }

      updateTransactionStatus('Database saved! Preparing blockchain transaction...');

      // Step 2: Register on blockchain
      const gasEstimate = await web3.contract.methods.registerDevice(
        productData.serial_number,
        productData.brand,
        productData.model,
        productData.device_type,
        productData.storage_data || "N/A",
        productData.color || "N/A",
        productData.batch_number || `BATCH-${Date.now()}`,
        specificationHash
      ).estimateGas({ from: web3.account });

      const gasPrice = web3.web3.utils.toWei('2', 'gwei');
      const gasLimit = Math.floor(gasEstimate * 1.2);

      updateTransactionStatus('Sending blockchain transaction...');

      const result = await web3.contract.methods.registerDevice(
        productData.serial_number,
        productData.brand,
        productData.model,
        productData.device_type,
        productData.storage_data || "N/A",
        productData.color || "N/A",
        productData.batch_number || `BATCH-${Date.now()}`,
        specificationHash
      ).send({
        from: web3.account,
        gas: gasLimit,
        gasPrice: gasPrice
      });

      updateTransactionStatus('Blockchain confirmed! Updating database...');

      // Step 3: Update backend with blockchain confirmation
      // This would be another API call to confirm the blockchain transaction
      
      updateTransactionStatus(
        `<div style="color: #10b981; text-align: center;">
          <h4>🎉 Product Registered Successfully!</h4>
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>Serial:</strong> ${productData.serial_number}</p>
            <p><strong>Brand:</strong> ${productData.brand} ${productData.model}</p>
            <p><strong>Transaction Hash:</strong> ${result.transactionHash}</p>
          </div>
          <p>The product is now registered on the blockchain!</p>
        </div>`
      );

      // Refresh dashboard data
      await refreshDashboard();
      
      // Reset form and show success
      setShowProductForm(false);
      showAlert('Product registered successfully!', 'success');

      // Auto-hide transaction modal after 5 seconds
      setTimeout(() => {
        hideTransactionModal();
      }, 5000);

    } catch (error: any) {
      console.error('Product registration error:', error);
      
      let errorMessage = 'Failed to register product';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user';
      } else if (error.code === -32603) {
        errorMessage = 'Internal JSON-RPC error';
      }

      updateTransactionStatus(
        `<div style="color: #ef4444; text-align: center;">
          <h4>❌ Registration Failed</h4>
          <p>${errorMessage}</p>
        </div>`
      );

      showAlert(errorMessage, 'error');

      // Auto-hide transaction modal after 3 seconds
      setTimeout(() => {
        hideTransactionModal();
      }, 3000);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle ownership transfer
  // const handleOwnershipTransfer = async (transferData: any) => {
  //   if (!web3.isConnected || !web3.account) {
  //     showAlert('Please connect your MetaMask wallet first!', 'error');
  //     return;
  //   }

  //   setFormLoading(true);
  //   showTransactionModal('Preparing ownership transfer...');

  //   try {
  //     updateTransactionStatus('Validating recipient address...');

  //     // Validate recipient address
  //     if (!web3.web3.utils.isAddress(transferData.newOwner)) {
  //       throw new Error('Invalid recipient address');
  //     }

  //     updateTransactionStatus('Checking device ownership...');

  //     // Check if user owns the device
  //     const deviceInfo = await web3.contract.methods.getDeviceInfo(transferData.serialNumber).call();
  //     if (deviceInfo.currentOwner.toLowerCase() !== web3.account.toLowerCase()) {
  //       throw new Error('You do not own this device');
  //     }

  //     updateTransactionStatus('Preparing blockchain transaction...');

  //     // Estimate gas
  //     const gasEstimate = await web3.contract.methods.transferOwnership(
  //       transferData.serialNumber,
  //       transferData.newOwner
  //     ).estimateGas({ from: web3.account });

  //     const gasPrice = web3.web3.utils.toWei('2', 'gwei');
  //     const gasLimit = Math.floor(gasEstimate * 1.2);

  //     updateTransactionStatus('Sending blockchain transaction...');

  //     const result = await web3.contract.methods.transferOwnership(
  //       transferData.serialNumber,
  //       transferData.newOwner
  //     ).send({
  //       from: web3.account,
  //       gas: gasLimit,
  //       gasPrice: gasPrice
  //     });

  //     updateTransactionStatus('Blockchain confirmed! Updating database...');

  //     // Step 3: Update backend database
  //     const backendResponse = await transferOwnership({
  //       serial_number: transferData.serialNumber,
  //       previous_owner: transferData.previous_owner,
  //       new_owner: transferData.new_number,
  //       transfer_reason: transferData.transfer_reason,
  //       notes: transferData.notes
  //     });

  //     if (backendResponse?.success != true) {
  //       console.warn('Backend update failed, but blockchain transfer succeeded');
  //     }

  //     updateTransactionStatus(
  //       `<div style="color: #10b981; text-align: center;">
  //         <h4>🎉 Ownership Transferred Successfully!</h4>
  //         <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
  //           <p><strong>Device:</strong> ${transferData.serialNumber}</p>
  //           <p><strong>New Owner:</strong> ${transferData.newOwner}</p>
  //           <p><strong>Transaction Hash:</strong> ${result.transactionHash}</p>
  //         </div>
  //         <p>The ownership has been transferred on the blockchain!</p>
  //       </div>`
  //     );

  //     // Refresh dashboard data
  //     await refreshDashboard();
      
  //     // Reset form and show success
  //     setShowTransferForm(false);
  //     showAlert('Ownership transferred successfully!', 'success');

  //     // Auto-hide transaction modal after 5 seconds
  //     setTimeout(() => {
  //       hideTransactionModal();
  //     }, 5000);

  //   } catch (error: any) {
  //     console.error('Ownership transfer error:', error);
      
  //     let errorMessage = 'Failed to transfer ownership';
  //     if (error.message) {
  //       errorMessage = error.message;
  //     } else if (error.code === 4001) {
  //       errorMessage = 'Transaction was rejected by user';
  //     }

  //     updateTransactionStatus(
  //       `<div style="color: #ef4444; text-align: center;">
  //         <h4>❌ Transfer Failed</h4>
  //         <p>${errorMessage}</p>
  //       </div>`
  //     );

  //     showAlert(errorMessage, 'error');

  //     // Auto-hide transaction modal after 3 seconds
  //     setTimeout(() => {
  //       hideTransactionModal();
  //     }, 3000);
  //   } finally {
  //     setFormLoading(false);
  //   }
  // };

  // Handle loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Handle no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            {profileError ? profileError : 'You need to be logged in as a manufacturer to access this page.'}
          </p>
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Handle wrong role - show loading while redirecting
  if (user && user.role !== 'manufacturer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <DashboardNavbar 
        user={user} 
        onRefreshProfile={refreshProfile} 
        setShowEditProfile={setShowEditProfile}
      />

      {/* Main Content */}
      <div className="pt-16"> {/* Account for fixed navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Manufacturer Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back, <span className="font-semibold">{user.current_company_name}</span>! Manage your products and track their lifecycle.
            </p>
          </div>

          {/* Connection Status */}
          <ConnectionStatus />

          {/* Dashboard Stats */}
          <DashboardStats 
            stats={stats}
            loading={statsLoading}
          />

          {/* Quick Actions */}
          <QuickActions
            setShowProductForm={setShowProductForm} />

          {/* <ManufacturerAnalyticsDashboard /> */}
        </div>
      </div>

      {/* Product Registration Form Modal */}
      {showProductForm && (
        <ProductRegistrationForm
          onSubmit={handleProductSubmit}
          onClose={() => setShowProductForm(false)}
          isLoading={formLoading}
          isOpen={showProductForm}
        />
      )}

     
      
      {showEditProfile && (
        <EditProfile
          onClose={() => setShowEditProfile(false)}
          userRole={user.role}
        />
      )}
    </div>
  );
};

export default ManufacturerDashboard;