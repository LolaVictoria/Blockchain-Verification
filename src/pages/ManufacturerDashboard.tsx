import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { CheckCircle, AlertTriangle, Upload } from 'lucide-react';
import Layout from '../components/Layout';

const ManufacturerDashboard = () => {
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState('');
  const [registeredProducts] = useState([
    { id: 'PRD-001', name: 'Premium Headphones', status: 'active', registeredAt: '2024-01-15' },
    { id: 'PRD-002', name: 'Wireless Speaker', status: 'active', registeredAt: '2024-01-10' },
    { id: 'PRD-003', name: 'Gaming Mouse', status: 'pending', registeredAt: '2024-01-08' },
    { id: 'PRD-004', name: 'Bluetooth Keyboard', status: 'active', registeredAt: '2024-01-05' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering product:', { productName, productId });
    // Product registration logic would go here
    setProductName('');
    setProductId('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manufacturer Dashboard</h1>
            <p className="text-gray-600 mt-2">Register and manage your products on the blockchain</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Registration Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Register New Product</CardTitle>
                <CardDescription>
                  Add a new product to the blockchain registry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productId">Product ID</Label>
                    <Input
                      id="productId"
                      type="text"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      placeholder="Enter unique product ID"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Product Image (Optional)</Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-blue-600 hover:text-blue-500">Upload a file</span>
                          <span> or drag and drop</span>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-security-blue hover:bg-blue-700">
                    Register Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Registered Products List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Registered Products</CardTitle>
                <CardDescription>
                  View and manage your product registry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registeredProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">ID: {product.id}</p>
                        <p className="text-xs text-gray-500">Registered: {product.registeredAt}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(product.status)}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Registered on blockchain</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verifications</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">Total verifications performed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.2%</div>
                <p className="text-xs text-muted-foreground">Authentic verifications</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManufacturerDashboard;
