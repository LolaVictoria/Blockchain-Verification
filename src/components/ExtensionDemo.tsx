import { useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Shield, CheckCircle, AlertTriangle, Scan, Loader2 } from 'lucide-react';

interface ProductCardProps {
  productName: string;
  price: string;
  image: string;
  hasVerification: boolean;
  verificationStatus: 'verified' | 'not-verified' | 'loading';
}

const ProductCard = ({ productName, price, image, hasVerification, verificationStatus }: ProductCardProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerificationClick = () => {
    setIsLoading(true);
    setIsPopupOpen(true);
    // Simulate blockchain data fetch
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const getVerificationBadge = () => {
    if (!hasVerification) return null;
    
    if (verificationStatus === 'loading' || isLoading) {
      return (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      );
    }
    
    return (
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogTrigger asChild>
          <button
            onClick={handleVerificationClick}
            className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Blockchain Verification
            </DialogTitle>
          </DialogHeader>
          <VerificationPopup 
            productName={productName} 
            status={verificationStatus}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="relative bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      {getVerificationBadge()}
      <img src={image} alt={productName} className="w-full h-48 object-cover rounded-md mb-3" />
      <h3 className="font-semibold text-gray-900 mb-1">{productName}</h3>
      <p className="text-lg font-bold text-green-600">{price}</p>
      <Button className="w-full mt-3" variant="outline">
        Add to Cart
      </Button>
    </div>
  );
};

interface VerificationPopupProps {
  productName: string;
  status: 'verified' | 'not-verified';
  isLoading: boolean;
}

const VerificationPopup = ({ productName, status, isLoading }: VerificationPopupProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Fetching blockchain data...</p>
      </div>
    );
  }

  const isVerified = status === 'verified';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-4">
        {isVerified ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <Badge className="bg-green-100 text-green-800">Verified</Badge>
          </div>
        ) : (
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <Badge className="bg-red-100 text-red-800">Not Verified</Badge>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Product:</span>
          <span className="font-medium">{productName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Product ID:</span>
          <span className="font-mono text-sm">PRD-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
        </div>
        {isVerified && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Manufacturer:</span>
              <span className="font-medium">TechCorp Industries</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Blockchain Record:</span>
              <span className="font-mono text-sm">0x7d2c...8f9a</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timestamp:</span>
              <span className="text-sm">2024-01-15 14:32:18 UTC</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ManualVerification = () => {
  const [productCode, setProductCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setProductCode('PRD-SCAN123');
      setIsScanning(false);
    }, 3000);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Manual Verification
        </CardTitle>
        <CardDescription>
          Enter a product code or scan to verify authenticity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="productCode">Product Code</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="productCode"
              value={productCode}
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductCode(e.target.value)}
              placeholder="Enter product code"
            />
            <Button 
              onClick={handleScan}
              disabled={isScanning}
              variant="outline"
              size="icon"
            >
              {isScanning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Scan className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <Button className="w-full">
          Verify Product
        </Button>
      </CardContent>
    </Card>
  );
};

const ExtensionDemo = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const mockProducts = [
    {
      productName: "Wireless Headphones Pro",
      price: "$199.99",
      image: "/placeholder.svg",
      hasVerification: true,
      verificationStatus: 'verified' as const
    },
    {
      productName: "Smart Watch Elite",
      price: "$299.99", 
      image: "/placeholder.svg",
      hasVerification: true,
      verificationStatus: 'not-verified' as const
    },
    {
      productName: "Gaming Mouse RGB",
      price: "$79.99",
      image: "/placeholder.svg",
      hasVerification: false,
      verificationStatus: 'verified' as const
    },
    {
      productName: "USB-C Hub Pro",
      price: "$49.99",
      image: "/placeholder.svg",
      hasVerification: true,
      verificationStatus: 'verified' as const
    }
  ];

  return (
    <div className={`min-h-screen transition-colors ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Browser Extension Demo</h1>
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant="outline"
          >
            {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>

        <ManualVerification />

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">E-commerce Product Listings</h2>
          <p className="text-gray-600 mb-4">
            Products with blockchain verification show a shield icon. Click to view verification details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Extension Features Demonstrated:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Shield badges overlay on verified products</li>
            <li>• Click-to-view verification popup with blockchain data</li>
            <li>• Manual product code verification interface</li>
            <li>• Loading animations during blockchain data fetch</li>
            <li>• Light/dark theme support</li>
            <li>• Responsive design for various screen sizes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExtensionDemo;
