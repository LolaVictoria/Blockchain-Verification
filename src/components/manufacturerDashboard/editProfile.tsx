import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Wallet, Building2, Plus, X, Check, AlertCircle, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import apiClient from '../../utils/apiClient';

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
  const { user } = useAuth();
  const { updateProfile, loading } = useProfile();
  
  // State management
  const [profileData, setProfileData] = useState<ProfileUpdateData>({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [alerts, setAlerts] = useState<{ message: string; type: 'success' | 'error' | 'warning' }[]>([]);
  const [modals, setModals] = useState({
    addEmail: false,
    addWallet: false,
    updateCompany: false
  });
  
  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [newWallet, setNewWallet] = useState('');
  const [walletLabel, setWalletLabel] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  
  // Load profile data on mount
  useEffect(() => {
    console.log('User data:', user); // Debug log
    if (user && user.emails) {
      setProfileData({
        emails: user.emails?.map((email: string) => ({
          email,
          isPrimary: email === user.primary_email,
          isVerified: true // Assuming all emails in array are verified
        })) || [],
        walletAddresses: user.wallet_addresses?.map((address: string) => ({
          address,
          isPrimary: address === user.primary_wallet,
          isVerified: user.verified_wallets?.includes(address) || false
        })) || [],
        companyNames: user.company_names?.map((name: string) => ({
          name,
          isCurrent: name === user.current_company_name,
          updatedAt: user.updated_at || new Date().toISOString()
        })) || []
      });
      setDataLoaded(true);
    }
  }, [user]);

  const showAlert = (message: string, type: 'success' | 'error' | 'warning') => {
    setAlerts(prev => [...prev, { message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.slice(1));
    }, 5000);
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    // Reset form states
    setNewEmail('');
    setNewWallet('');
    setWalletLabel('');
    setNewCompanyName('');
  };

  // API calls using the optimized single endpoint
  const handleProfileUpdate = async (updateData: any, action: string) => {
    try {
      const response = await apiClient.post('/manufacturer/profile', {
        action,
        ...updateData
      });

      if (response.data.status === 'success') {
        showAlert(response.data.message || 'Profile updated successfully!', 'success');
        
        // Update local profile data
        if (response.data.user) {
          setProfileData({
            emails: response.data.user.emails?.map((email: string) => ({
              email,
              isPrimary: email === response.data.user.primary_email,
              isVerified: true
            })) || [],
            walletAddresses: response.data.user.wallet_addresses?.map((address: string) => ({
              address,
              isPrimary: address === response.data.user.primary_wallet,
              isVerified: response.data.user.verified_wallets?.includes(address) || false
            })) || [],
            companyNames: response.data.user.company_names?.map((name: string) => ({
              name,
              isCurrent: name === response.data.user.current_company_name,
              updatedAt: new Date().toISOString()
            })) || []
          });
          
          // Update global user state
          await updateProfile(response.data.user);
        }
      }
    } catch (error: any) {
      showAlert(error.message || 'Update failed', 'error');
    }
  };

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    await handleProfileUpdate({ email: newEmail }, 'add_email');
    closeModal('addEmail');
  };

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWallet) return;
    
    await handleProfileUpdate({ 
      wallet_address: newWallet, 
      label: walletLabel 
    }, 'add_wallet');
    closeModal('addWallet');
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName) return;
    
    await handleProfileUpdate({ company_name: newCompanyName }, 'update_company');
    closeModal('updateCompany');
  };

  const handleSetPrimaryEmail = async (email: string) => {
    await handleProfileUpdate({ email }, 'set_primary_email');
  };

  const handleSetPrimaryWallet = async (address: string) => {
    await handleProfileUpdate({ wallet_address: address }, 'set_primary_wallet');
  };

  const handleRemoveEmail = async (email: string) => {
    if (!window.confirm(`Are you sure you want to remove ${email}?`)) return;
    await handleProfileUpdate({ email }, 'remove_email');
  };

  const handleRemoveWallet = async (address: string) => {
    if (!window.confirm(`Are you sure you want to remove this wallet?`)) return;
    await handleProfileUpdate({ wallet_address: address }, 'remove_wallet');
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-h-[98vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-transparent hover:bg-opacity-20 rounded-lg transition-colors"
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
                <p className="opacity-90">Manage your profile information securely</p>
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
            {alert.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{alert.message}</span>
          </div>
        ))}

        {/* Loading state */}
        {!dataLoaded && user && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading profile data...</p>
          </div>
        )}

        {/* No user data */}
        {!user && (
          <div className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Unable to load user data. Please try refreshing the page.</p>
          </div>
        )}

        {/* Main content */}
        {dataLoaded && (
          <div className="p-6 space-y-6">
            {/* Email Management */}
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
                      <div className="flex space-x-2">
                        {!emailObj.isPrimary && profileData.emails!.length > 1 && (
                          <>
                            <button
                              onClick={() => handleSetPrimaryEmail(emailObj.email)}
                              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                              Set Primary
                            </button>
                            <button
                              onClick={() => handleRemoveEmail(emailObj.email)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          </>
                        )}
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

              <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <button
                  onClick={() => setModals(prev => ({ ...prev, addEmail: true }))}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Email</span>
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Add backup emails. Only verified emails can be set as primary.
                </p>
              </div>
            </div>

            {/* Manufacturer-specific sections */}
            {userRole === 'manufacturer' && (
              <>
                {/* Wallet Management */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Wallet className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Wallet Addresses</h3>
                  </div>
                  
                  {profileData.walletAddresses && profileData.walletAddresses.length > 0 ? (
                    <div className="space-y-3">
                      {profileData.walletAddresses.map((walletObj, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {walletObj.label || 'Wallet'}
                            </div>
                            <div className="font-mono text-sm text-gray-600 break-all">{walletObj.address}</div>
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
                          <div className="flex space-x-2">
                            {!walletObj.isPrimary && walletObj.isVerified && (
                              <button
                                onClick={() => handleSetPrimaryWallet(walletObj.address)}
                                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                              >
                                Set Primary
                              </button>
                            )}
                            {profileData.walletAddresses!.length > 1 && (
                              <button
                                onClick={() => handleRemoveWallet(walletObj.address)}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            )}
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

                  <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <button
                      onClick={() => setModals(prev => ({ ...prev, addWallet: true }))}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Wallet</span>
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      Only verified wallets can be used for product registration.
                    </p>
                  </div>
                </div>

                {/* Company Information */}
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

                  <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <button
                      onClick={() => setModals(prev => ({ ...prev, updateCompany: true }))}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Update Company Name</span>
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      Company name changes are tracked for transparency.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Modals */}
        {modals.addEmail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add New Email</h3>
                <button
                  onClick={() => closeModal('addEmail')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddEmail}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter new email address"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Adding...' : 'Add Email'}
                </button>
              </form>
            </div>
          </div>
        )}

        {modals.addWallet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add New Wallet</h3>
                <button
                  onClick={() => closeModal('addWallet')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddWallet}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={newWallet}
                    onChange={(e) => setNewWallet(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={walletLabel}
                    onChange={(e) => setWalletLabel(e.target.value)}
                    placeholder="e.g., Main Wallet, Hardware Wallet"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Adding...' : 'Add Wallet'}
                </button>
              </form>
            </div>
          </div>
        )}

        {modals.updateCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Update Company Name</h3>
                <button
                  onClick={() => closeModal('updateCompany')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateCompany}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Company Name
                  </label>
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Enter new company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Current:</strong> {user?.current_company_name || 'Not set'}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Company'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;