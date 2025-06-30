import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from "../components/ui/input";
import { Label } from '../components/ui/label';
import { CheckCircle, AlertTriangle, Search } from 'lucide-react';
import Layout from '../components/Layout';

const CustomerVerification = () => {
  const [productId, setProductId] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'authentic' | 'fake' | null;
    productName?: string;
    manufacturer?: string;
    registeredDate?: string;
  }>({ status: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock verification logic
      const isAuthentic = productId.startsWith('PRD-');
      
      if (isAuthentic) {
        setVerificationResult({
          status: 'authentic',
          productName: 'Premium Headphones',
          manufacturer: 'TechCorp Industries',
          registeredDate: '2024-01-15'
        });
      } else {
        setVerificationResult({
          status: 'fake'
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const resetVerification = () => {
    setVerificationResult({ status: null });
    setProductId('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Product Verification</h1>
            <p className="text-gray-600 mt-2">Enter a Product ID to verify its authenticity</p>
          </div>

          {/* Verification Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Verify Product Authenticity
              </CardTitle>
              <CardDescription>
                Enter the Product ID found on your product's packaging or QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerification} className="space-y-4">
                <div>
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    type="text"
                    value={productId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductId(e.target.value)}
                    placeholder="Enter Product ID (e.g., PRD-001)"
                    required
                    className="text-lg py-3"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-security-blue hover:bg-blue-700 flex-1"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Product'}
                  </Button>
                  {verificationResult.status && (
                    <Button type="button" variant="outline" onClick={resetVerification}>
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Verification Results */}
          {verificationResult.status && (
            <Card className={`border-2 ${
              verificationResult.status === 'authentic' 
                ? 'border-green-300 bg-green-50' 
                : 'border-red-300 bg-red-50'
            }`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    verificationResult.status === 'authentic'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}>
                    {verificationResult.status === 'authentic' ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    )}
                  </div>
                  
                  <h2 className={`text-2xl font-bold mb-2 ${
                    verificationResult.status === 'authentic'
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}>
                    {verificationResult.status === 'authentic' ? 'Product is Authentic' : 'Product Not Authentic'}
                  </h2>
                  
                  <p className={`text-lg mb-6 ${
                    verificationResult.status === 'authentic'
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}>
                    {verificationResult.status === 'authentic'
                      ? 'This product has been verified on the blockchain and is genuine.'
                      : 'This product could not be verified. It may be counterfeit or the ID is incorrect.'
                    }
                  </p>

                  {verificationResult.status === 'authentic' && (
                    <div className="bg-white rounded-lg p-6 text-left max-w-md mx-auto">
                      <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Product Name:</span>
                          <span className="font-medium">{verificationResult.productName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Manufacturer:</span>
                          <span className="font-medium">{verificationResult.manufacturer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Registered:</span>
                          <span className="font-medium">{verificationResult.registeredDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Product ID:</span>
                          <span className="font-medium">{productId}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Verify</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Method 1: Product ID</h3>
                  <p className="text-gray-600 text-sm">
                    Look for the unique Product ID printed on the packaging or product label. 
                    Enter it in the form above to verify authenticity.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Method 2: QR Code</h3>
                  <p className="text-gray-600 text-sm">
                    Scan the QR code on the product packaging with your smartphone camera. 
                    The QR code contains the Product ID for easy verification.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerVerification;
