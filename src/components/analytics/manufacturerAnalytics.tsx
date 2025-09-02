import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, Shield, Clock, Database, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';
import MetricCard from "./metricCard";
import { useAnalytics } from '../../hooks/useAnalytics';
import type { 
  VerificationTrend, 
  KPIs, 
  DeviceAnalytic, 
  // CustomerEngagement, 
  CounterfeitLocation 
} from '../../utils/AnalyticsService';

const ManufacturerAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('all');

  const {
    loading,
    error,
    verificationTrends,
    deviceAnalytics,
    customerEngagement,
    counterfeitLocations,
    loadManufacturerAnalytics,
    setError
  } = useAnalytics(timeRange);
  
  // Load data when component mounts or timeRange changes
  useEffect(() => {
    loadManufacturerAnalytics();
  }, [loadManufacturerAnalytics]);

  // Device types for filter
  const deviceTypes: string[] = [
    'Smartphone', 'Laptop', 'Tablet', 'Desktop', 'Monitor', 
    'Camera', 'Audio Device', 'Gaming Console', 'Smart Watch', 'Other'
  ];

  // Extract data with proper type safety
  const trendsData: VerificationTrend[] = verificationTrends?.verificationTrends || [];
  const kpis: KPIs | undefined = verificationTrends?.kpis;

  // Use API KPIs first, fallback to calculated values
  const displayMetrics = {
    verificationAccuracy: kpis?.verificationAccuracy?.toFixed(1) || 
      (trendsData.length > 0 ? ((trendsData.reduce((sum, day) => sum + day.successful, 0) / 
      trendsData.reduce((sum, day) => sum + day.successful + day.failed, 0)) * 100).toFixed(1) : '0'),
    
    avgResponseTime: kpis?.avgResponseTime?.toFixed(2) || 
      (trendsData.length > 0 ? (trendsData.reduce((sum, day) => sum + day.responseTime, 0) / trendsData.length).toFixed(2) : '0'),
    
    transactionEfficiency: kpis?.transactionEfficiency?.toFixed(1) || 
      (trendsData.length > 0 ? ((trendsData.reduce((sum, day) => sum + day.transactions, 0) / 
      trendsData.reduce((sum, day) => sum + day.successful + day.failed, 0)) * 100).toFixed(1) : '0'),
    
    avgSecurityScore: trendsData.length > 0 ? 
      (trendsData.reduce((sum, day) => sum + day.securityScore, 0) / trendsData.length).toFixed(1) : '0'
  };

  // Filter device analytics
  const filteredDeviceAnalytics: DeviceAnalytic[] = selectedDeviceType === 'all' 
    ? deviceAnalytics 
    : deviceAnalytics.filter(device => device.name === selectedDeviceType);

  // Loading state
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

  // Error state
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
                    loadManufacturerAnalytics();
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
            Manufacturer Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive analytics for consumer electronics verification system
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex space-x-2">
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
          
          <div className="flex space-x-2">
            <label className="text-sm font-medium text-gray-700 self-center">Device Type:</label>
            <select 
              value={selectedDeviceType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDeviceType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Devices</option>
              {deviceTypes.map((type: string) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Verification Accuracy"
            value={displayMetrics.verificationAccuracy}
            unit="%"
            icon={CheckCircle}
            color="green"
            formula="(Successful Verifications) / (Total Attempts) × 100%"
          />
          <MetricCard
            title="Avg Response Time"
            value={displayMetrics.avgResponseTime}
            unit="s"
            icon={Clock}
            color="blue"
            formula="Σ(Individual Response Times) / (Total Requests)"
          />
          <MetricCard
            title="Transaction Efficiency"
            value={displayMetrics.transactionEfficiency}
            unit="%"
            icon={Database}
            color="purple"
            formula="(Successful Transactions) / (Total Attempts) × 100%"
          />
          <MetricCard
            title="Security Score"
            value={displayMetrics.avgSecurityScore}
            unit="/100"
            icon={Shield}
            color="orange"
            formula="(Security Tests Passed) / (Total Security Tests) × 100%"
          />
        </div>

        {/* KPI Performance Summary - Using API KPIs */}
        {kpis && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Detailed KPI Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-700">Total Attempts</h4>
                <p className="text-3xl font-bold text-blue-600">{kpis.totalAttempts.toLocaleString()}</p>
                <p className="text-sm text-blue-500">Verification Requests</p>
              </div>
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-700">Successful</h4>
                <p className="text-3xl font-bold text-green-600">{kpis.successfulVerifications.toLocaleString()}</p>
                <p className="text-sm text-green-500">Verifications</p>
              </div>
              <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-700">API Response Time</h4>
                <p className="text-3xl font-bold text-purple-600">{kpis.avgResponseTime.toFixed(2)}s</p>
                <p className="text-sm text-purple-500">Average Speed</p>
              </div>
              <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-700">API Accuracy</h4>
                <p className="text-3xl font-bold text-orange-600">{kpis.verificationAccuracy.toFixed(1)}%</p>
                <p className="text-sm text-orange-500">Success Rate</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Verification Trends */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Verification Trends Over Time</h3>
            {trendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="successful" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Successful" />
                  <Area type="monotone" dataKey="failed" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Failed" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No verification data available
              </div>
            )}
          </div>

          {/* Device Type Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Verifications by Device Type</h3>
            {filteredDeviceAnalytics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredDeviceAnalytics.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="verifications" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No device data available
              </div>
            )}
          </div>
        </div>

        {/* Customer Engagement */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Customer Engagement Analytics</h3>
          {customerEngagement.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="users" orientation="left" />
                <YAxis yAxisId="satisfaction" orientation="right" domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="users" dataKey="newCustomers" fill="#3B82F6" name="New Customers" />
                <Bar yAxisId="users" dataKey="returningCustomers" fill="#10B981" name="Returning Customers" />
                <Line yAxisId="satisfaction" type="monotone" dataKey="avgSatisfaction" stroke="#F59E0B" strokeWidth={3} name="Avg Satisfaction" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No customer engagement data available
            </div>
          )}
        </div>

        {/* Counterfeit Detection & Location Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Counterfeit Detection by Device */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Counterfeit Detection by Device</h3>
            {deviceAnalytics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deviceAnalytics.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="authentic" fill="#10B981" name="Authentic" />
                  <Bar dataKey="counterfeit" fill="#EF4444" name="Counterfeit" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No counterfeit data available
              </div>
            )}
          </div>

          {/* Counterfeit Reports by Location */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Counterfeit Reports by Location</h3>
            {counterfeitLocations.length > 0 ? (
              <div className="space-y-3">
                {counterfeitLocations.map((item: CounterfeitLocation, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">{item.location}</p>
                        <p className="text-sm text-gray-600">{item.deviceType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{item.reports}</p>
                      <p className="text-xs text-gray-500">reports</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No counterfeit reports available
              </div>
            )}
          </div>
        </div>

        {/* System Performance Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">System Performance Analysis</h3>
          {trendsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="time" orientation="left" />
                <YAxis yAxisId="score" orientation="right" domain={[95, 100]} />
                <Tooltip />
                <Legend />
                <Line yAxisId="time" type="monotone" dataKey="responseTime" stroke="#3B82F6" strokeWidth={3} name="Response Time (s)" />
                <Line yAxisId="score" type="monotone" dataKey="securityScore" stroke="#10B981" strokeWidth={3} name="Security Score %" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No performance data available
            </div>
          )}
        </div>

        {/* Action Items & Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Key Insights & Action Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">High Verification Accuracy</p>
                <p className="text-sm text-green-700">
                  {displayMetrics.verificationAccuracy}% accuracy rate exceeds industry standards
                  {kpis && ` (API: ${kpis.totalAttempts.toLocaleString()} total attempts)`}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-800">Counterfeit Hotspots</p>
                <p className="text-sm text-orange-700">
                  Focus anti-counterfeit efforts on {counterfeitLocations.length} reported regions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Response Time Optimization</p>
                <p className="text-sm text-blue-700">
                  Average {displayMetrics.avgResponseTime}s response time - excellent performance
                  {kpis && ` (${kpis.successfulVerifications.toLocaleString()} successful verifications)`}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-800">Transaction Efficiency</p>
                <p className="text-sm text-purple-700">
                  {displayMetrics.transactionEfficiency}% transaction success rate maintains system reliability
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerAnalyticsDashboard;