// components/verification/CounterfeitAlertComponent.tsx
import React, { useState } from 'react';
import { AlertTriangle, MapPin, Send, X, CheckCircle } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { CounterfeitReportData } from '../../utils/AnalyticsService';

interface CounterfeitAlertComponentProps {
  serialNumber: string;
  brand: string;
  productName?: string;
  onClose: () => void;
  onReportSuccess?: (reportId: string) => void;
}

const CounterfeitAlertComponent: React.FC<CounterfeitAlertComponentProps> = ({ 
  serialNumber, 
  brand,
  productName,
  onClose,
  onReportSuccess
}) => {
  const { submitCounterfeitReport, loading } = useAnalytics();
  
  const [showLocationConsent, setShowLocationConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [locationData, setLocationData] = useState({
    storeName: '',
    storeAddress: '',
    city: '',
    state: '',
    purchaseDate: '',
    purchasePrice: '',
    additionalNotes: ''
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState<string>('');

  const handleLocationConsentClick = () => {
    setShowLocationConsent(true);
  };

  const handleConsentAccept = () => {
    setConsentGiven(true);
    setShowLocationConsent(false);
  };

  const handleConsentDecline = () => {
    setConsentGiven(false);
    setShowLocationConsent(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitReport = async () => {
    setSubmitError(null);
    
    const reportData: CounterfeitReportData = {
      serialNumber,
      productName: productName || brand,
      customerConsent: consentGiven,
      locationData: consentGiven ? {
        ...locationData,
        // Clean up empty fields
        storeName: locationData.storeName.trim() || undefined,
        storeAddress: locationData.storeAddress.trim() || undefined,
        city: locationData.city.trim() || undefined,
        state: locationData.state.trim() || undefined,
        purchaseDate: locationData.purchaseDate || undefined,
        purchasePrice: locationData.purchasePrice || undefined,
        additionalNotes: locationData.additionalNotes.trim() || undefined,
      } : undefined,
    };

    try {
      const result = await submitCounterfeitReport(reportData);
      
      if (result.success) {
        setReportId(result.reportId);
        setSubmitted(true);
        
        if (onReportSuccess) {
          onReportSuccess(result.reportId);
        }
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setSubmitError(result.message || 'Failed to submit report');
      }
      
    } catch (error) {
      console.error('Error submitting counterfeit report:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Report Submitted Successfully</h3>
            <p className="text-gray-600 mb-4">
              Thank you for helping us fight counterfeits. Your report has been recorded with ID: 
              <strong className="font-mono text-sm"> {reportId}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {consentGiven 
                ? 'The manufacturer has been notified with location details and will take appropriate action.' 
                : 'Your report has been logged to help track counterfeit patterns.'}
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-red-600">Counterfeit Product Detected</h2>
              <p className="text-gray-600">Help us protect other customers</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Product Details */}
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">Product Information</h3>
          <p className="text-red-700"><strong>Product:</strong> {productName || brand}</p>
          <p className="text-red-700"><strong>Serial Number:</strong> {serialNumber}</p>
          <p className="text-red-700 text-sm mt-2">
            This product failed our authentication checks and appears to be counterfeit.
          </p>
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{submitError}</span>
            </div>
          </div>
        )}

        {/* Location Consent Section */}
        {!showLocationConsent && !consentGiven && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-2">Help Us Track Counterfeit Sources</h3>
                <p className="text-blue-700 mb-4">
                  With your permission, we'd like to notify the manufacturer about where this counterfeit 
                  product was purchased. This helps them take action against counterfeit sellers and 
                  protect other customers.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleLocationConsentClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Yes, Share Purchase Location
                  </button>
                  <button
                    onClick={handleConsentDecline}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    No, Just Record Detection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Consent Modal */}
        {showLocationConsent && (
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Data Sharing Consent</h3>
            <div className="space-y-3 text-sm text-gray-600 mb-4">
              <p>✓ We will share the purchase location with the manufacturer</p>
              <p>✓ This helps them identify and shut down counterfeit sellers</p>
              <p>✓ Your personal information remains private</p>
              <p>✓ Only location details of where you bought the product will be shared</p>
              <p>✓ You can withdraw consent anytime by contacting support</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleConsentAccept}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                I Consent
              </button>
              <button
                onClick={handleConsentDecline}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Location Details Form (if consent given) */}
        {consentGiven && (
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-800 mb-4">Purchase Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={locationData.storeName}
                  onChange={(e) => handleInputChange('storeName', e.target.value)}
                  placeholder="e.g., Electronics Hub"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={locationData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="e.g., Lagos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
                <input
                  type="text"
                  value={locationData.storeAddress}
                  onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                  placeholder="e.g., 123 Victoria Island, Lagos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={locationData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="e.g., Lagos State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={locationData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (₦)</label>
                <input
                  type="number"
                  value={locationData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  placeholder="e.g., 250000"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                <textarea
                  value={locationData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any additional information about the purchase..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Close
          </button>
          <button
            onClick={handleSubmitReport}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </div>

        {/* Data Usage Note */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Privacy Note:</strong> This information helps manufacturers identify counterfeit distribution 
            networks. Only location details are shared - your personal information remains private and secure.
            Report ID will be provided for tracking purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CounterfeitAlertComponent;