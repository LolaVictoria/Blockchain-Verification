import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ComposedChart } from 'recharts';
import { TrendingUp, Shield, Clock, Database, CheckCircle, AlertTriangle, MapPin, Users, Activity, FileText } from 'lucide-react';
import MetricCard from "./metricCard";
import { useManufacturerAnalytics }  from '../../hooks/useAnalytics';
import type { 
  VerificationTrend, 
  kpis, 
  ManufacturerDeviceAnalytic,  
  CustomerEngagement, 
  CounterfeitLocation,
  ManufacturerVerificationLog  
} from '../../utils/AnalyticsService';
// Time Range Filter Component
const TimeRangeFilter = ({ 
  timeRange, 
  setTimeRange 
}: {
  timeRange: string;
  setTimeRange: (range: string) => void;
}) => {
  const ranges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  return (
    <div className="flex space-x-2">
      <label className="text-sm font-medium text-gray-700 self-center">Time Range:</label>
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => setTimeRange(range.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeRange === range.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

// Device Type Filter Component
const DeviceTypeFilter = ({
  selectedDeviceType,
  setSelectedDeviceType
}: {
  selectedDeviceType: string;
  setSelectedDeviceType: (type: string) => void;
}) => {
  const deviceTypes = [
    'Smartphone', 'Laptop', 'Tablet', 'Desktop', 'Monitor', 
    'Camera', 'Audio Device', 'Gaming Console', 'Smart Watch', 'Other'
  ];

  return (
    <div className="flex space-x-2">
      <label className="text-sm font-medium text-gray-700 self-center">Device Type:</label>
      <select 
        value={selectedDeviceType}
        onChange={(e) => setSelectedDeviceType(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
      >
        <option value="all">All Devices</option>
        {deviceTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

// KPI Overview Component
const KPIOverview = ({ kpis }: { kpis: kpis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Verification Accuracy"
        value={kpis.verificationAccuracy.toFixed(1)}
        unit="%"
        icon={CheckCircle}
        color="green"
        formula="(Successful Verifications) / (Total Attempts) × 100%"
      />
      <MetricCard
        title="Avg Response Time"
        value={kpis.avgResponseTime.toFixed(2)}
        unit="s"
        icon={Clock}
        color="blue"
        formula="Σ(Individual Response Times) / (Total Requests)"
      />
      <MetricCard
        title="Transaction Efficiency"
        value={kpis.transactionEfficiency.toFixed(1)}
        unit="%"
        icon={Database}
        color="purple"
        formula="(Successful Transactions) / (Total Attempts) × 100%"
      />
      <MetricCard
        title="Counterfeit Rate"
        value={kpis.counterfeitRate.toFixed(1)}
        unit="%"
        icon={Shield}
        color="red"
        formula="(Total Counterfeit) / (Total Attempts) × 100%"
      />
    </div>
  );
};

// Detailed KPI Breakdown Component
const DetailedKPIBreakdown = ({ kpis }: { kpis: kpis }) => {
  return (
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
          <p className="text-sm text-green-500">Authentic Products</p>
        </div>
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-700">Total Counterfeit</h4>
          <p className="text-3xl font-bold text-red-600">{kpis.totalCounterfeit.toLocaleString()}</p>
          <p className="text-sm text-red-500">Fake Products Detected</p>
        </div>
        <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-700">API Response Time</h4>
          <p className="text-3xl font-bold text-purple-600">{kpis.avgResponseTime.toFixed(2)}s</p>
          <p className="text-sm text-purple-500">Average Speed</p>
        </div>
      </div>
    </div>
  );
};


// Add Manufacturer Verification Logs Component
const ManufacturerVerificationLogsTable = ({ 
  data 
}: { 
  data: ManufacturerVerificationLog[] 
}) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No verification logs available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Serial Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Device
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Response Time
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(0, 20).map((log, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {log.serialNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{log.deviceName}</div>
                  <div className="text-sm text-gray-500">{log.deviceCategory}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{log.customerName}</div>
                  <div className="text-sm text-gray-500">{log.customerEmail}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  log.status === 'Authentic' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {log.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Updated Device Analytics Chart Component
const DeviceAnalyticsChart = ({ data }: { data: ManufacturerDeviceAnalytic[] }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No device data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data.slice(0, 6)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="authentic" fill="#10B981" name="Authentic" />
        <Bar dataKey="counterfeit" fill="#EF4444" name="Counterfeit" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Verification Trends Chart Component
const VerificationTrendsChart = ({ data }: { data: VerificationTrend[] }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No verification data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="successful" 
          stackId="1" 
          stroke="#10B981" 
          fill="#10B981" 
          fillOpacity={0.6} 
          name="Successful" 
        />
        <Area 
          type="monotone" 
          dataKey="counterfeit" 
          stackId="1" 
          stroke="#EF4444" 
          fill="#EF4444" 
          fillOpacity={0.6} 
          name="Counterfeit" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};


// Customer Engagement Chart Component
const CustomerEngagementChart = ({ data }: { data: CustomerEngagement[] }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No customer engagement data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="users" orientation="left" />
        <YAxis yAxisId="satisfaction" orientation="right" domain={[0, 5]} />
        <Tooltip />
        <Legend />
        <Bar yAxisId="users" dataKey="activeCustomers" fill="#3B82F6" name="Active Customers" />
        <Bar yAxisId="users" dataKey="totalVerifications" fill="#8B5CF6" name="Total Verifications" />
        <Line 
          yAxisId="satisfaction" 
          type="monotone" 
          dataKey="avgSatisfaction" 
          stroke="#F59E0B" 
          strokeWidth={3} 
          name="Avg Satisfaction" 
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Counterfeit Locations Component
const CounterfeitLocationsList = ({ data }: { data: CounterfeitLocation[] }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No counterfeit reports available
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {data.map((item, index) => (
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
  );
};

// Insights Component
const InsightsSection = ({ 
  kpis, 
  counterfeitLocations 
}: { 
  kpis: kpis; 
  counterfeitLocations: CounterfeitLocation[]; 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Key Insights & Action Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">High Verification Accuracy</p>
            <p className="text-sm text-green-700">
              {kpis.verificationAccuracy.toFixed(1)}% accuracy rate with {kpis.totalAttempts.toLocaleString()} total attempts
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Counterfeit Detection</p>
            <p className="text-sm text-red-700">
              {kpis.totalCounterfeit.toLocaleString()} counterfeit products detected ({kpis.counterfeitRate.toFixed(1)}% rate)
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Response Time Performance</p>
            <p className="text-sm text-blue-700">
              Average {kpis.avgResponseTime.toFixed(2)}s response time - excellent performance
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
          <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <p className="font-medium text-purple-800">Geographic Hotspots</p>
            <p className="text-sm text-purple-700">
              Focus anti-counterfeit efforts on {counterfeitLocations.length} reported regions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingState = () => (
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

// Error Component
const ErrorState = ({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry: () => void; 
}) => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Analytics</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={onRetry}
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

// Main Dashboard Component
const ManufacturerAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('all');

  const {
    loading,
    error,
    kpis,
    verificationTrends,
    deviceAnalytics,  
    customerEngagement,
    counterfeitLocations,
    verificationLogs,  // Add verification logs
    loadManufacturerAnalytics,
    setError
  } = useManufacturerAnalytics(timeRange);

  useEffect(() => {
    loadManufacturerAnalytics();
  }, [loadManufacturerAnalytics]);

  // Filter device analytics based on selected type
  const filteredDeviceAnalytics = selectedDeviceType === 'all' 
    ? deviceAnalytics 
    : deviceAnalytics.filter((device) => device.name === selectedDeviceType);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState 
        error={error} 
        onRetry={() => {
          setError(null);
          loadManufacturerAnalytics();
        }} 
      />
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
            Comprehensive analytics for product verification and counterfeit detection
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <TimeRangeFilter timeRange={timeRange} setTimeRange={setTimeRange} />
          <DeviceTypeFilter 
            selectedDeviceType={selectedDeviceType} 
            setSelectedDeviceType={setSelectedDeviceType} 
          />
        </div>

        {/* KPI Overview */}
        {kpis && <KPIOverview kpis={kpis} />}

        {/* Detailed KPI Breakdown */}
        {kpis && <DetailedKPIBreakdown kpis={kpis} />}

        {/* Main Analytics Charts - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Verification Trends Over Time */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              <TrendingUp className="inline h-5 w-5 mr-2" />
              Verification Trends Over Time
            </h3>
            <VerificationTrendsChart data={verificationTrends} />
          </div>

          {/* Verifications by Device Type */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              <Database className="inline h-5 w-5 mr-2" />
              Verifications by Device Type
            </h3>
            {filteredDeviceAnalytics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredDeviceAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="verifications" fill="#3B82F6" name="Total Verifications" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No device data available
              </div>
            )}
          </div>
        </div>

        {/* Analytics Charts - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Counterfeit Detection by Device */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              <Shield className="inline h-5 w-5 mr-2" />
              Counterfeit Detection by Device
            </h3>
            <DeviceAnalyticsChart data={filteredDeviceAnalytics} />
          </div>

          {/* Counterfeit Reports by Location */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              <MapPin className="inline h-5 w-5 mr-2" />
              Counterfeit Reports by Location
            </h3>
            <CounterfeitLocationsList data={counterfeitLocations} />
          </div>
        </div>

        {/* Customer Engagement Analytics */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            <Users className="inline h-5 w-5 mr-2" />
            Customer Engagement Analytics
          </h3>
          <CustomerEngagementChart data={customerEngagement} />
        </div>

        {/* System Performance Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            <Activity className="inline h-5 w-5 mr-2" />
            System Performance Analysis
          </h3>
          {verificationTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={verificationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  name="Response Time (s)" 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No performance data available
            </div>
          )}
        </div>

        {/* Verification Logs Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            <FileText className="inline h-5 w-5 mr-2" />
            Recent Verification Logs
          </h3>
          <ManufacturerVerificationLogsTable data={verificationLogs} />
        </div>

        {/* Key Insights & Action Items */}
        {kpis && (
          <InsightsSection 
            kpis={kpis} 
            counterfeitLocations={counterfeitLocations} 
          />
        )}

      </div>
    </div>
  );
};

export default ManufacturerAnalyticsDashboard;