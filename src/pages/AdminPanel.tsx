import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Activity, Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';

const AdminPanel = () => {
  const [contractStatus, setContractStatus] = useState(true);
  
  const systemActivity = [
    { id: 1, type: 'product_registered', details: 'TechCorp registered "Premium Headphones"', timestamp: '2 hours ago', user: 'TechCorp Industries' },
    { id: 2, type: 'verification', details: 'Product PRD-001 verified successfully', timestamp: '3 hours ago', user: 'Customer' },
    { id: 3, type: 'manufacturer_approved', details: 'AudioPro Industries approved as manufacturer', timestamp: '5 hours ago', user: 'Admin' },
    { id: 4, type: 'verification', details: 'Product PRD-002 verification failed', timestamp: '6 hours ago', user: 'Customer' },
    { id: 5, type: 'product_registered', details: 'AudioPro registered "Wireless Earbuds"', timestamp: '8 hours ago', user: 'AudioPro Industries' },
  ];

  const pendingManufacturers = [
    { id: 1, name: 'SmartTech Solutions', email: 'contact@smarttech.com', registeredAt: '2024-01-20', status: 'pending' },
    { id: 2, name: 'InnovateCorp', email: 'info@innovate.com', registeredAt: '2024-01-19', status: 'pending' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'product_registered':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'verification':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'manufacturer_approved':
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'product_registered':
        return <Badge className="bg-blue-100 text-blue-800">Product Registered</Badge>;
      case 'verification':
        return <Badge className="bg-green-100 text-green-800">Verification</Badge>;
      case 'manufacturer_approved':
        return <Badge className="bg-purple-100 text-purple-800">Manufacturer Approved</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const handleApproveManufacturer = (id: number) => {
    console.log('Approving manufacturer:', id);
    // Approval logic would go here
  };

  const handleRejectManufacturer = (id: number) => {
    console.log('Rejecting manufacturer:', id);
    // Rejection logic would go here
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">Monitor system activity and manage blockchain operations</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verifications Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">+5% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Manufacturers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">2 pending approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.7%</div>
                <p className="text-xs text-muted-foreground">Verification success rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Controls */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Smart Contract Controls</CardTitle>
                <CardDescription>
                  Manage blockchain smart contract operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="contract-status">Contract Status</Label>
                    <p className="text-sm text-gray-600">
                      {contractStatus ? 'Contract is active and processing transactions' : 'Contract is frozen - no new registrations'}
                    </p>
                  </div>
                  <Switch
                    id="contract-status"
                    checked={contractStatus}
                    onCheckedChange={setContractStatus}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    variant={contractStatus ? "destructive" : "default"}
                    className="w-full"
                    onClick={() => setContractStatus(!contractStatus)}
                  >
                    {contractStatus ? 'Freeze Contract' : 'Activate Contract'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Export System Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    Backup Database
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>
                  Latest product registrations and verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{activity.details}</p>
                          {getActivityBadge(activity.type)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{activity.user}</span>
                          <span className="mx-2">•</span>
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Manufacturer Approvals */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Pending Manufacturer Approvals
              </CardTitle>
              <CardDescription>
                Review and approve new manufacturer registration requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingManufacturers.map((manufacturer) => (
                  <div key={manufacturer.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{manufacturer.name}</h3>
                      <p className="text-sm text-gray-600">{manufacturer.email}</p>
                      <p className="text-xs text-gray-500">Applied: {manufacturer.registeredAt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        className="bg-security-green hover:bg-green-700"
                        onClick={() => handleApproveManufacturer(manufacturer.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectManufacturer(manufacturer.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
