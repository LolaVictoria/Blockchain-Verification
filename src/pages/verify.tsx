import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerification } from '../hooks/useVerification';
import type { VerificationResult, BatchVerificationResult, SampleData, OwnershipRecord } from '../../src/utils/VerificationService';
import { copyToClipboard } from '../utils/helper';
import { CopyableText } from '../utils/CopyToClipboard';
// Loading Spinner Component
const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center p-8 text-gray-500">
    <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
    <p>{message || 'Loading...'}</p>
  </div>
);

// Result Card Component
const ResultCard: React.FC<{
  type: 'authentic' | 'counterfeit' | 'not-found' | 'error';
  children: React.ReactNode;
 }> = ({ type, children }) => {
  const styles = {
    authentic: 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 shadow-md',
    counterfeit: 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 shadow-md',
    'not-found': 'bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-400 shadow-md',
    error: 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 shadow-md'
  };

  return (
    <div className={`p-6 rounded-xl my-4 ${styles[type]}`}>
      {children}
    </div>
  );
};

// Main Verification Page Component
const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    verifyProduct,
    verifyBatch,
    loadSampleData,
    getOwnershipHistory,
    clearError
  } = useVerification();

  const [activeTab, setActiveTab] = useState('verify');
  const [serialNumber, setSerialNumber] = useState('');
  const [batchSerials, setBatchSerials] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [batchResults, setBatchResults] = useState<BatchVerificationResult | null>(null);
  const [sampleData, setSampleData] = useState<SampleData | null>(null);
  
  const [ownershipModal, setOwnershipModal] = useState<{
    open: boolean;
    serialNumber: string;
    history: OwnershipRecord[];
    loading: boolean;
  }>({
    open: false,
    serialNumber: '',
    history: [],
    loading: false
  });

  // Handle single device verification
  const handleVerifyDevice = async () => {
    try {
      clearError();
      const result = await verifyProduct(serialNumber);
      setVerificationResult(result);
    } catch (err) {
      console.error('Verification failed:', err);
      setVerificationResult(null);
    }
  };

  // Handle batch verification
  const handleVerifyBatch = async () => {
    const serialNumbers = batchSerials.split('\n').map(s => s.trim()).filter(s => s);
    
    try {
      clearError();
      const result = await verifyBatch(serialNumbers);
      setBatchResults(result);
    } catch (err) {
      console.error('Batch verification failed:', err);
      setBatchResults(null);
    }
  };

  // Handle loading sample data
  const handleLoadSampleData = async () => {
    try {
      clearError();
      const data = await loadSampleData();
      setSampleData(data);
    } catch (err) {
      console.error('Failed to load sample data:', err);
    }
  };

  // Show ownership history
  const showOwnershipHistory = async (serial: string) => {
    setOwnershipModal({ open: true, serialNumber: serial, history: [], loading: true });

    try {
      const data = await getOwnershipHistory(serial);
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

  // Quick verify function
  const quickVerify = (serial: string) => {
    setSerialNumber(serial);
    setActiveTab('verify');
    setTimeout(() => handleVerifyDevice(), 100);
  };

 
  // Load sample data when tab changes
  useEffect(() => {
    if (activeTab === 'sample' && !sampleData) {
      handleLoadSampleData();
    }
  }, [activeTab, sampleData]);

  // Render verification result
  const renderVerificationResult = () => {
    if (!verificationResult) return null;

    const { authentic, source, blockchain_proof, message } = verificationResult;
    
    let resultType: 'authentic' | 'counterfeit' | 'not-found' = 'not-found';
    let statusIcon = '❓';
    let statusText = 'Not Found';
    
    if (authentic) {
      resultType = 'authentic';
      statusIcon = '✅';
      statusText = 'Authentic Product';
    } else if (message && message.includes('not found')) {
      resultType = 'not-found';
    } else {
      resultType = 'counterfeit';
      statusIcon = '❌';
      statusText = 'Counterfeit or Invalid';
    }

    const verificationBadge = source === 'blockchain' 
      ? '🔗 Blockchain Verified'
      : source === 'database' 
      ? '💾 Database Verified'
      : '';

    return (
      <ResultCard type={resultType}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{statusIcon} {statusText}</h3>
          {verificationBadge && (
            <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-200">
              {verificationBadge}
            </span>
          )}
        </div>
        
        <p className="mb-4 text-gray-700">
          <strong>Serial Number:</strong>{' '}
          <code className="bg-gray-200 px-3 py-1 rounded-lg font-mono text-sm text-gray-800">
            {verificationResult.serialNumber}
          </code>
        </p>
        
        {message && <p className="mb-4 italic text-gray-600 bg-gray-100 p-3 rounded-lg">{message}</p>}
        
        {authentic && (verificationResult.brand || verificationResult.model) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200">
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Brand</div>
              <div className="text-sm text-gray-600">{verificationResult.brand || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Model</div>
              <div className="text-sm text-gray-600">{verificationResult.model || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Device Type</div>
              <div className="text-sm text-gray-600">{verificationResult.deviceType || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Storage</div>
              <div className="text-sm text-gray-600">{verificationResult.storage || verificationResult.storageData || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Color</div>
              <div className="text-sm text-gray-600">{verificationResult.color || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Manufacturer</div>
              <div className="text-sm text-gray-600">{verificationResult.manufacturerName || 'Unknown'}</div>
            </div>
            
            {blockchain_proof && (
              <>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Network</div>
                  <div className="text-sm text-gray-600">{blockchain_proof.network || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Contract</div>
                  <div className="text-sm text-gray-600">
                    {blockchain_proof.explorer_links?.contract ? (
                      <a 
                        href={blockchain_proof.explorer_links.contract} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Contract
                      </a>
                    ) : (
                      'Contract address not available'
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Transaction</div>
                  <div className="text-sm text-gray-600">
                    {blockchain_proof.explorer_links?.transaction ? (
                      <a 
                        href={blockchain_proof.explorer_links.transaction} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline font-semibold"
                      >
                        View on Explorer ↗
                      </a>
                    ) : (
                      'Transaction hash not available'
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {authentic && (
          <div className="flex gap-3 flex-wrap mt-4">
            <button
              onClick={() => showOwnershipHistory(verificationResult.serialNumber)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>📋</span> View Ownership History
            </button>
          </div>
        )}
      </ResultCard>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Navigation */}
          <div className="mb-8">
            <div className="flex justify-center gap-6 border-b-2 border-gray-200 pb-6">
              <button
                onClick={() => setActiveTab('verify')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                  activeTab === 'verify' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border border-gray-200'
                }`}
              >
                🔍 Single Verification
              </button>
              <button
                onClick={() => setActiveTab('batch')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                  activeTab === 'batch' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border border-gray-200'
                }`}
              >
                Batch Verification
              </button>
              <button
                onClick={() => setActiveTab('sample')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                  activeTab === 'sample' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border border-gray-200'
                }`}
              >
                Sample Data
              </button>
            </div>
          </div>

          {/* Single Verification Tab */}
          {activeTab === 'verify' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Verify Product Authenticity
              </h2>
              <p className="text-center text-gray-600 mb-8 text-lg">
                Enter a product serial number to verify its authenticity using our blockchain system
              </p>

              <form onSubmit={(e) => { e.preventDefault(); handleVerifyDevice(); }}>
                <div className="mb-8">
                  <label htmlFor="serialNumber" className="block text-sm font-semibold text-gray-700 mb-3">
                    Product Serial Number
                  </label>
                  <input
                    type="text"
                    id="serialNumber"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    required
                    placeholder="Enter serial number (e.g., ABCV-25-0607)"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-mono"
                  />
                  <small className="text-gray-500 mt-2 block">
                    Serial numbers are case-sensitive and must match exactly
                  </small>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Verifying...' : 'Verify Product'}
                </button>
              </form>

              {/* Quick Test Buttons */}
              <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <h4 className="mb-4 font-bold text-gray-700">Quick Test Serials:</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSerialNumber('ABCV-25-0607')}
                    className="px-5 py-3 text-sm border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-200 font-semibold"
                  >
                    Sample Device
                  </button>
                  <button
                    onClick={() => setSerialNumber('FAKE001')}
                    className="px-5 py-3 text-sm border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 font-semibold"
                  >
                    Fake Device
                  </button>
                </div>
              </div>

              {/* Results */}
              {isLoading && <LoadingSpinner message="Verifying device authenticity..." />}
              {error && (
                <ResultCard type="error">
                  <h3 className="text-xl font-bold mb-3">Verification Error</h3>
                  <p className="mb-2">Failed to verify device. Please try again.</p>
                  <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg font-mono">Error: {error}</p>
                </ResultCard>
              )}
              {renderVerificationResult()}
            </div>
          )}

          {/* Batch Verification Tab */}
          {activeTab === 'batch' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Batch Verification
              </h2>
              <p className="text-center text-gray-600 mb-8 text-lg">
                Verify multiple products at once (up to 10 devices)
              </p>

              <form onSubmit={(e) => { e.preventDefault(); handleVerifyBatch(); }}>
                <div className="mb-8">
                  <label htmlFor="batchSerials" className="block text-sm font-semibold text-gray-700 mb-3">
                    Serial Numbers (one per line)
                  </label>
                  <textarea
                    id="batchSerials"
                    value={batchSerials}
                    onChange={(e) => setBatchSerials(e.target.value)}
                    required
                    rows={8}
                    placeholder="Enter serial numbers, one per line:&#10;ABCV-25-0607&#10;FAKE001"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-mono resize-none"
                  />
                  <small className="text-gray-500 mt-2 block">
                    Enter up to 10 serial numbers, one per line
                  </small>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Verifying Batch...' : 'Verify Batch'}
                </button>
              </form>

              {/* Sample Batch Input */}
              <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <h4 className="mb-4 font-bold text-gray-700">Quick Test:</h4>
                <button
                  onClick={() => setBatchSerials('ABCV-25-0607\nFAKE001\nSAMPLE123')}
                  className="px-5 py-3 text-sm border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 font-semibold"
                >
                  Load Sample Batch
                </button>
              </div>

              {/* Batch Results */}
              {isLoading && <LoadingSpinner message="Verifying devices..." />}
              {error && (
                <ResultCard type="error">
                  <h3 className="text-xl font-bold mb-3">Batch Verification Failed</h3>
                  <p className="mb-2">Failed to verify devices. Please try again.</p>
                  <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg font-mono">Error: {error}</p>
                </ResultCard>
              )}
              {batchResults && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">
                    Batch Verification Results ({batchResults.results.length} devices)
                  </h3>
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-lg font-semibold text-blue-800">
                      Verified: {batchResults.total_verified}/{batchResults.total_checked} devices
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {batchResults.results.map((result, index) => {
                      let statusClass = 'border-gray-300 bg-gray-50';
                      let statusIcon = '?';
                      let statusText = 'Not Found';

                      if (result.authentic) {
                        statusClass = 'border-green-300 bg-green-50';
                        statusIcon = '✓';
                        statusText = 'Authentic';
                      } else if (result.source && result.source !== 'not_found') {
                        statusClass = 'border-red-300 bg-red-50';
                        statusIcon = '✗';
                        statusText = 'Counterfeit';
                      }

                      const verificationSource = result.source === 'blockchain' ? 'Blockchain' 
                                                : result.source === 'database' ? 'Database' 
                                                : 'Unknown';

                      return (
                        <div key={index} className={`p-6 rounded-xl border-l-4 shadow-md ${statusClass}`}>
                          <div className="flex justify-between items-center mb-4">
                            <strong className="font-mono text-lg">{statusIcon} {result.serialNumber}</strong>
                            <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold border">{verificationSource}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div><strong>Status:</strong> {statusText}</div>
                            {result.brand && <div><strong>Brand:</strong> {result.brand}</div>}
                            {result.model && <div><strong>Model:</strong> {result.model}</div>}
                            {result.manufacturerName && <div><strong>Manufacturer:</strong> {result.manufacturerName}</div>}
                          </div>
                          {result.authentic && (
                            <div className="mt-4">
                              <button
                                onClick={() => showOwnershipHistory(result.serialNumber)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
                              >
                                View History
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sample Data Tab */}
          {activeTab === 'sample' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Sample Test Data
              </h2>
              <p className="text-center text-gray-600 mb-8 text-lg">
                Explore sample products in our database for testing
              </p>

              <div className="text-center mb-8">
                <button
                  onClick={handleLoadSampleData}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Loading...' : 'Load Sample Data'}
                </button>
              </div>

              {isLoading && <LoadingSpinner message="Loading sample data..." />}
              {error && (
                <ResultCard type="error">
                  <h3 className="text-xl font-bold mb-3">Error Loading Sample Data</h3>
                  <p className="mb-2">Please check if the backend server is running.</p>
                  <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg font-mono">Error: {error}</p>
                </ResultCard>
              )}
              
              {sampleData && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Authentic Blockchain Devices */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-l-4 border-green-500 rounded-xl p-6 shadow-lg">
                      <h4 className="font-bold text-green-800 mb-3 text-lg">Authentic Devices (Blockchain)</h4>
                      <p className="text-sm text-green-700 mb-4">These devices are verified on the blockchain</p>
                      <div className="space-y-3">
                        {sampleData.authentic?.blockchain?.map(serial => (
                          <div key={serial} className="bg-white p-4 rounded-lg border border-green-200 flex justify-between items-center shadow-sm">
                            <span 
                              onClick={() => copyToClipboard(serial, 'Transaction Hash')}
                              className="font-mono cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-all duration-200"
                              title="Click to copy"
                            >
                              {serial}
                            </span>
                            <button
                              onClick={() => quickVerify(serial)}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold"
                            >
                              Verify
                            </button>
                          </div>
                        )) || <p className="text-gray-600 italic">No blockchain devices found</p>}
                      </div>
                    </div>

                    {/* Authentic Database Devices */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 border-l-4 border-blue-500 rounded-xl p-6 shadow-lg">
                      <h4 className="font-bold text-blue-800 mb-3 text-lg">Authentic Devices (Database)</h4>
                      <p className="text-sm text-blue-700 mb-4">These devices are verified via database</p>
                      <div className="space-y-3">
                        {sampleData.authentic?.database?.map(serial => (
                          <div key={serial} className="bg-white p-4 rounded-lg border border-blue-200 flex justify-between items-center shadow-sm">
                            <span 
                              onClick={() => copyToClipboard(serial, 'Serial Number')}
                              className="font-mono cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-all duration-200"
                              title="Click to copy"
                            >
                              {serial}
                            </span>
                            <button
                              onClick={() => quickVerify(serial)}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
                            >
                              Verify
                            </button>
                          </div>
                        )) || <p className="text-gray-600 italic">No database devices found</p>}
                      </div>
                    </div>

                    {/* Counterfeit/Invalid Devices */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-100 border-l-4 border-red-500 rounded-xl p-6 shadow-lg">
                      <h4 className="font-bold text-red-800 mb-3 text-lg">Counterfeit/Invalid Devices</h4>
                      <p className="text-sm text-red-700 mb-4">These serial numbers should fail verification</p>
                      <div className="space-y-3">
                        {sampleData.counterfeit?.map(serial => (
                          <div key={serial} className="bg-white p-4 rounded-lg border border-red-200 flex justify-between items-center shadow-sm">
                            <span 
                              onClick={() => copyToClipboard(serial,  'Serial Number')}
                              className="font-mono cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-all duration-200"
                              title="Click to copy"
                            >
                              {serial}
                            </span>
                            <button
                              onClick={() => quickVerify(serial)}
                              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold"
                            >
                              Test
                            </button>
                          </div>
                        )) || <p className="text-gray-600 italic">No test devices found</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Back to Home Link */}
          <div className="text-center mt-8">
            <button 
              className="text-blue-600 hover:text-blue-800 transition-colors font-semibold text-lg"
              onClick={() => navigate(-1)}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </main>

      {/* Ownership History Modal */}
      {ownershipModal.open && (
        <div className="fixed inset-0 bg-white bg-opacity-50 z-50  p-4">
          <div className="bg-white rounded-2xl  h-[95vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Ownership History</h3>
              <button
                onClick={() => setOwnershipModal(prev => ({ ...prev, open: false }))}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {ownershipModal.loading ? (
                <LoadingSpinner message="Loading ownership history..." />
              ) : ownershipModal.history.length > 0 ? (
                <div>
                  <h4 className="font-bold mb-4 text-gray-800">Serial Number: {ownershipModal.serialNumber}</h4>
                  <div className="space-y-4">
                    {ownershipModal.history.map((record, index) => {
                      const date = new Date(record.transfer_date || record.date || '').toLocaleDateString();
                      return (
                        <div key={index} className="relative pl-8 pb-4">
                          <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <p className="mb-2"><strong>From:</strong> {record.from || record.previous_owner || '_'}</p>
                            <p className="mb-2"><strong>To:</strong> {record.to || record.new_owner || 'Unknown'}</p>
                            <p className="mb-2"><strong>Date:</strong> {date}</p>
                            <p className="mb-2"><strong>Note:</strong> {record.transfer_reason || record.reason || 'Ownership Transfer'}</p>
                            {record.transaction_hash && (
                              <p>
                                <strong>Transaction:</strong>{' '}
                                <CopyableText
                                  text={record.transaction_hash}
                                  className="text-xs bg-gray-200 px-2 py-1 rounded font-mono border border-transparent"
                                  successMessage="Transaction Hash to clipboard!"
                                />
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <ResultCard type="not-found">
                  <h4 className="font-bold">No Ownership History</h4>
                  <p>No ownership transfers found for this device.</p>
                  <p>This device may still be with the original manufacturer.</p>
                </ResultCard>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;