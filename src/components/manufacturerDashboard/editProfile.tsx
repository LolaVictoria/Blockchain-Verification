import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Wallet, Building2, AlertCircle, Settings } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';

interface EditProfileProps {
  onClose: () => void;
  userRole: string;
}

interface Email {
  email: string;
  isPrimary: boolean;
  isVerified: boolean;
}

interface WalletAddress {
  address: string;
  label?: string;
  isPrimary: boolean;
  isVerified: boolean;
}

interface CompanyName {
  name: string;
  isCurrent: boolean;
  updatedAt: string;
}

interface ProfileUpdateData {
  emails?: Email[];
  walletAddresses?: WalletAddress[];
  companyNames?: CompanyName[];
  primaryEmail?: string;
  primaryWallet?: string;
  currentCompanyName?: string;
}

const EditProfile: React.FC<EditProfileProps> = ({ onClose, userRole }) => {
  // Use only useAuthContext - single source of truth
  const { user, loading, error } = useAuthContext();
  
  // State management
  const [profileData, setProfileData] = useState<ProfileUpdateData>({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [alerts, setAlerts] = useState<{ message: string; type: 'success' | 'error' | 'warning' }[]>([]);

  // Helper function to show alerts
  const showAlert = (message: string, type: 'success' | 'error' | 'warning') => {
    setAlerts(prev => [...prev, { message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.slice(1));
    }, 5000);
  };

  // Copy wallet address functionality
  const handleCopyWalletAddress = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      showAlert('Wallet address copied to clipboard', 'success');
    }).catch(() => {
      showAlert('Failed to copy wallet address', 'error');
    });
  };

  // Load profile data from user object
  useEffect(() => {
    if (user && !dataLoaded) {
      console.log('Loading profile data from user:', user);
      setProfileData({
        emails: user.emails?.map((email: string) => ({
          email,
          isPrimary: email === user.primary_email,
          isVerified: true // Assuming all emails in array are verified
        })) || [],
        walletAddresses: user.wallet_addresses?.map((address: string) => ({
          address,
          isPrimary: address === user.primary_wallet,
          isVerified: user.verified_wallets?.includes(address) || false,
          label: address === user.primary_wallet ? 'Primary' : 'Secondary'
        })) || [],
        companyNames: user.company_names?.map((name: string) => ({
          name,
          isCurrent: name === user.current_company_name,
          updatedAt: user.updated_at || new Date().toISOString()
        })) || []
      });
      setDataLoaded(true);
      
      // Show success alert when data loads
      showAlert('Profile data loaded successfully', 'success');
    }
  }, [user, dataLoaded]);

  // Show alert for unverified accounts
  useEffect(() => {
    if (user && !user.is_auth_verified && dataLoaded) {
      showAlert('Your account is pending verification. Some features may be limited.', 'warning');
    }
  }, [user, dataLoaded]);

  // Show alert for missing important information
  useEffect(() => {
    if (user && dataLoaded) {
      const missingInfo = [];
      
      if (!user.emails || user.emails.length === 0) {
        missingInfo.push('email address');
      }
      
      if (userRole === 'manufacturer' && (!user.wallet_addresses || user.wallet_addresses.length === 0)) {
        missingInfo.push('wallet address');
      }
      
      if (userRole === 'manufacturer' && !user.current_company_name) {
        missingInfo.push('company name');
      }
      
      if (missingInfo.length > 0) {
        showAlert(
          `Please complete your profile by adding: ${missingInfo.join(', ')}`, 
          'warning'
        );
      }
    }
  }, [user, userRole, dataLoaded]);

  // Show alert for wallet verification status
  useEffect(() => {
    if (user && userRole === 'manufacturer' && dataLoaded) {
      const unverifiedWallets = user.wallet_addresses?.filter(
        address => !user.verified_wallets?.includes(address)
      ) || [];
      
      if (unverifiedWallets.length > 0) {
        showAlert(
          `You have ${unverifiedWallets.length} wallet(s) pending verification`,
          'warning'
        );
      }
    }
  }, [user, userRole, dataLoaded]);

  // Show alert for data freshness
  useEffect(() => {
    if (user && dataLoaded && user.updated_at) {
      const lastUpdate = new Date(user.updated_at);
      const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceUpdate > 30) {
        showAlert(
          `Your profile was last updated ${daysSinceUpdate} days ago. Consider reviewing your information.`,
          'warning'
        );
      }
    }
  }, [user, dataLoaded]);

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Unable to load user data. Please try refreshing the page.</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-10 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-h-[98vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-transparent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className='flex items-center'>
                  <Settings className="mr-3 h-10 w-10" />
                  <h1 className="text-2xl font-bold">
                    Profile Settings
                  </h1>
                </div>
                <p className="opacity-90">View your profile information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`mx-6 mt-4 p-3 rounded-lg flex items-center space-x-2 ${
              alert.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
              alert.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
              'bg-yellow-50 border border-yellow-200 text-yellow-800'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>{alert.message}</span>
          </div>
        ))}

        {/* Show global error if any */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg flex items-center space-x-2 bg-red-50 border border-red-200 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Show loading skeleton while data is being processed */}
        {!dataLoaded ? (
          <div className="p-6 space-y-6">
            {/* Account Info Skeleton */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Email Section Skeleton */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Wallet Section Skeleton (if manufacturer) */}
            {userRole === 'manufacturer' && (
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mt-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 mt-2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Main content */
          <div className="p-6 space-y-6">
            {/* Basic User Info Display */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-gray-900">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Status</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.is_auth_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.is_auth_verified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="text-gray-900">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Email Management - View Only */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Email Addresses</h3>
              </div>
              
              {profileData.emails && profileData.emails.length > 0 ? (
                <div className="space-y-3">
                  {profileData.emails.map((emailObj, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{emailObj.email}</div>
                        <div className="flex space-x-2 mt-1">
                          {emailObj.isPrimary && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Primary
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No email addresses found</p>
                </div>
              )}
            </div>

            {/* Manufacturer-specific sections */}
            {userRole === 'manufacturer' && (
              <>
                {/* Wallet Management - View Only */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Wallet className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Wallet Addresses</h3>
                  </div>
                  
                  {profileData.walletAddresses && profileData.walletAddresses.length > 0 ? (
                    <div className="space-y-3">
                      {profileData.walletAddresses.map((walletObj, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {walletObj.label || 'Wallet'}
                            </div>
                            <div className="font-mono text-sm text-gray-600 break-all flex items-center group">
                              <span className="mr-2">{walletObj.address}</span>
                              <button
                                onClick={() => handleCopyWalletAddress(walletObj.address)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all duration-200"
                                title="Copy address"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <div className="flex space-x-2 mt-1">
                              {walletObj.isPrimary && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Primary
                                </span>
                              )}
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                walletObj.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {walletObj.isVerified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No wallet addresses found</p>
                    </div>
                  )}
                </div>

                {/* Company Information - View Only */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                  </div>
                  
                  {profileData.companyNames && profileData.companyNames.length > 0 ? (
                    <div className="space-y-3">
                      {profileData.companyNames.map((companyObj, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{companyObj.name}</div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              companyObj.isCurrent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {companyObj.isCurrent ? 'Current' : 'Historical'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No company information found</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;