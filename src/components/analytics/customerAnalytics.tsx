import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Shield, CheckCircle, Clock, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import MetricCard from "./metricCard";
import { useAnalytics } from '../../hooks/useAnalytics';
import type { 
  CustomerVerificationHistory, 
  CustomerDeviceBreakdown 
} from '../../utils/AnalyticsService';

const CustomerAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState<string>('30d');
  
  const {
    loading,
    error,
    customerHistory,
    customerDevices,
    loadCustomerAnalytics,
    setError
  } = useAnalytics(timeRange);

  // Load data when component mounts or timeRange changes
  useEffect(() => {
    loadCustomerAnalytics();
  }, [loadCustomerAnalytics]);

  // Platform trust indicators (static data - can be moved to API later)
  const platformTrustMetrics = [
    { metric: 'Platform Uptime', score: 99.9, color: '#10B981' },
    { metric: 'Data Security', score: 98.5, color: '#3B82F6' },
    { metric: 'Verification Speed', score: 97.8, color: '#F59E0B' },
    { metric: 'User Satisfaction', score: 96.2, color: '#8B5CF6' }
  ];

  // Calculate customer metrics from API data with proper typing
  const totalCustomerVerifications: number = customerHistory.reduce((sum: number, day: CustomerVerificationHistory) => sum + day.verifications, 0);
  const totalAuthentic: number = customerHistory.reduce((sum: number, day: CustomerVerificationHistory) => sum + day.authentic, 0);
  const totalCounterfeit: number = customerHistory.reduce((sum: number, day: CustomerVerificationHistory) => sum + day.counterfeit, 0);
  
  const customerAuthenticRate: string = totalCustomerVerifications > 0 
    ? ((totalAuthentic / totalCustomerVerifications) * 100).toFixed(1)
    : '0';
    
  const avgVerificationTime: string = totalCustomerVerifications > 0
    ? (customerHistory.reduce((sum: number, day: CustomerVerificationHistory) => sum + (day.avgTime * day.verifications), 0) / totalCustomerVerifications).toFixed(2)
    : '0';

  const totalDevicesVerified: number = customerDevices.reduce((sum: number, device: CustomerDeviceBreakdown) => sum + device.count, 0);

  // Calculate overall platform trust score
  const platformTrustScore: string = (platformTrustMetrics.reduce((sum, metric) => sum + metric.score, 0) / platformTrustMetrics.length).toFixed(1);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Analytics</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button 
                  onClick={() => {
                    setError(null);
                    loadCustomerAnalytics();
                  }}
                  className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Verification Analytics
          </h1>
          <p className="text-gray-600">
            Track your product verification history and platform insights
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="flex space-x-2 mb-6">
          <label className="text-sm font-medium text-gray-700 self-center">Time Range:</label>
          {(['7d', '30d', '90d', '1y'] as const).map((range: string) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : 
               range === '30d' ? 'Last 30 Days' : 
               range === '90d' ? 'Last 90 Days' : 'Last Year'}
            </button>
          ))}
        </div>

        {/* Customer Personal Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Verifications"
            value={totalCustomerVerifications.toString()}
            unit=""
            icon={Package}
            color="blue"
            formula="Sum of all verification requests"
          />
          <MetricCard
            title="Authentic Rate"
            value={customerAuthenticRate}
            unit="%"
            icon={CheckCircle}
            color="green"
            formula="(Authentic Products) / (Total Verifications) × 100%"
          />
          <MetricCard
            title="Avg Verification Time"
            value={avgVerificationTime}
            unit="s"
            icon={Clock}
            color="purple"
            formula="Weighted average response time"
          />
          <MetricCard
            title="Trust Score"
            value={platformTrustScore}
            unit="/100"
            icon={Shield}
            color="orange"
            formula="Platform reliability metrics average"
          />
        </div>

        {/* Customer Detailed Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Verification Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-700">Total Devices</h4>
              <p className="text-3xl font-bold text-blue-600">{totalDevicesVerified}</p>
              <p className="text-sm text-blue-500">Devices Verified</p>
            </div>
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-700">Authentic Found</h4>
              <p className="text-3xl font-bold text-green-600">{totalAuthentic}</p>
              <p className="text-sm text-green-500">Genuine Products</p>
            </div>
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-700">Counterfeits Detected</h4>
              <p className="text-3xl font-bold text-red-600">{totalCounterfeit}</p>
              <p className="text-sm text-red-500">Fake Products Caught</p>
            </div>
          </div>
        </div>

        {/* Customer Verification Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Verification Activity</h3>
            {customerHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="authentic" stackId="1" fill="#10B981" name="Authentic" />
                  <Bar dataKey="counterfeit" stackId="1" fill="#EF4444" name="Counterfeit" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No verification data available
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Device Types Verified</h3>
            {customerDevices.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerDevices}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
                  >
                    {customerDevices.map((entry: CustomerDeviceBreakdown, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No device data available
              </div>
            )}
          </div>
        </div>

        {/* Platform Trust & Security */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Platform Security & Trust</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {platformTrustMetrics.map((metric, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{metric.metric}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${metric.score}%`, 
                          backgroundColor: metric.color 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12">{metric.score}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-4xl font-bold text-green-600">{platformTrustScore}%</div>
              <p className="text-gray-600 text-center">Platform Trust Score</p>
              <div className="flex items-center mt-2 text-green-600">
                <Shield className="h-5 w-5 mr-1" />
                <span className="text-sm">Blockchain Secured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Verification Statistics</h3>
          {customerHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="count" orientation="left" />
                <YAxis yAxisId="time" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="count" dataKey="authentic" fill="#10B981" name="Authentic Products" />
                <Bar yAxisId="count" dataKey="counterfeit" fill="#EF4444" name="Counterfeit Detected" />
                <Line yAxisId="time" type="monotone" dataKey="avgTime" stroke="#3B82F6" strokeWidth={3} name="Avg Time (s)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No statistics available
            </div>
          )}
        </div>

        {/* Device Breakdown Details */}
        {customerDevices.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Device Verification Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerDevices.map((device: CustomerDeviceBreakdown, index: number) => (
                <div key={index} className="p-4 border rounded-lg" style={{ borderColor: device.color }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{device.name}</h4>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: device.color }}></div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">Total: <span className="font-medium">{device.count}</span></p>
                    <p className="text-green-600">Authentic: <span className="font-medium">{device.authentic}</span></p>
                    <p className="text-red-600">Counterfeit: <span className="font-medium">{device.counterfeit}</span></p>
                    <p className="text-gray-500">
                      Success Rate: <span className="font-medium">
                        {device.count > 0 ? ((device.authentic / device.count) * 100).toFixed(1) : '0'}%
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Your Verification Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Great Track Record</p>
                <p className="text-sm text-green-700">
                  {customerAuthenticRate}% of your {totalCustomerVerifications} verified products are authentic
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Fast Verification</p>
                <p className="text-sm text-blue-700">
                  Average verification time: {avgVerificationTime}s across {totalDevicesVerified} devices
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-800">Secure Platform</p>
                <p className="text-sm text-purple-700">
                  Your data is protected by blockchain technology with {platformTrustScore}% trust score
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-800">Security Awareness</p>
                <p className="text-sm text-orange-700">
                  You've detected {totalCounterfeit} counterfeit products, protecting yourself and others
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalyticsDashboard;