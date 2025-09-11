import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Manufacturer Device Analytics Interface
interface ManufacturerDeviceAnalytic {
  name: string;
  verifications: number;
  authentic: number;
  counterfeit: number;
  color?: string;
  customerCount: number;
  authenticityRate: number;
  avgConfidence: number;
  recentVerifications: number;
}

interface DetailedDeviceBreakdown {
  deviceName: string;
  deviceCategory: string;
  verifications: number;
  authentic: number;
  counterfeit: number;
  customerCount: number;
}

interface ManufacturerDeviceAnalyticsProps {
  data: ManufacturerDeviceAnalytic[];
  detailedBreakdown?: DetailedDeviceBreakdown[];
  loading?: boolean;
  error?: string | null;
  onCategorySelect?: (category: string) => void;
}

// Custom colors for charts
const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

// Custom tooltip components
const VerificationTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
        <p className="font-medium text-gray-900">{`${label}`}</p>
        <p className="text-sm text-blue-600">{`Total Verifications: ${data.verifications}`}</p>
        <p className="text-sm text-green-600">{`Authentic: ${data.authentic}`}</p>
        <p className="text-sm text-red-600">{`Counterfeit: ${data.counterfeit}`}</p>
        <p className="text-sm text-purple-600">{`Customers: ${data.customerCount}`}</p>
        <p className="text-sm text-gray-600">{`Authenticity Rate: ${data.authenticityRate}%`}</p>
        <p className="text-sm text-gray-600">{`Avg Confidence: ${data.avgConfidence}%`}</p>
      </div>
    );
  }
  return null;
};

const PerformanceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${entry.dataKey.includes('Rate') || entry.dataKey.includes('Confidence') ? '%' : ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ManufacturerDeviceAnalyticsComponent: React.FC<ManufacturerDeviceAnalyticsProps> = ({
  data,
  // detailedBreakdown = [],
  loading = false,
  error = null,
  onCategorySelect
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'performance' | 'details'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate aggregate metrics
  const totalVerifications = data.reduce((sum, item) => sum + item.verifications, 0);
  const totalAuthentic = data.reduce((sum, item) => sum + item.authentic, 0);
  const totalCounterfeit = data.reduce((sum, item) => sum + item.counterfeit, 0);
  const totalCustomers = data.reduce((sum, item) => sum + item.customerCount, 0);
  const avgAuthenticityRate = data.length > 0 
    ? (data.reduce((sum, item) => sum + item.authenticityRate, 0) / data.length).toFixed(1)
    : 0;
  const avgConfidence = data.length > 0 
    ? (data.reduce((sum, item) => sum + item.avgConfidence, 0) / data.length).toFixed(1)
    : 0;

  // Prepare data for different chart types
  const verificationData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));

  const pieData = data.map((item, index) => ({
    name: item.name,
    value: item.verifications,
    authentic: item.authentic,
    counterfeit: item.counterfeit,
    color: item.color || COLORS[index % COLORS.length]
  }));

  const performanceData = data.map(item => ({
    name: item.name,
    authenticityRate: item.authenticityRate,
    avgConfidence: item.avgConfidence,
    customerCount: item.customerCount
  }));

  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="text-red-600 text-center">
          <p className="font-medium">Error loading device analytics</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="text-gray-500 text-center py-8">
          <p className="font-medium">No device analytics available</p>
          <p className="text-sm mt-1">Device verifications will appear here once customers start using your products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Device Analytics Dashboard</h3>
        <p className="text-gray-600">Performance insights across your product portfolio</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalVerifications}</div>
          <div className="text-sm text-blue-800">Total Verifications</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalAuthentic}</div>
          <div className="text-sm text-green-800">Authentic</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{totalCounterfeit}</div>
          <div className="text-sm text-red-800">Counterfeit</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{totalCustomers}</div>
          <div className="text-sm text-purple-800">Customers</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">{avgAuthenticityRate}%</div>
          <div className="text-sm text-indigo-800">Avg Auth Rate</div>
        </div>
        <div className="bg-teal-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-teal-600">{avgConfidence}%</div>
          <div className="text-sm text-teal-800">Avg Confidence</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {['overview', 'performance', 'details'].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === view
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart Views */}
      {selectedView === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Verification Volume */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Verification Volume by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={verificationData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  interval={0}
                />
                <YAxis />
                <Tooltip content={<VerificationTooltip />} />
                <Legend />
                <Bar 
                  dataKey="authentic" 
                  stackId="a" 
                  fill="#10B981" 
                  name="Authentic"
                  onClick={(data) => handleCategoryClick(data.name)}
                  style={{ cursor: 'pointer' }}
                />
                <Bar 
                  dataKey="counterfeit" 
                  stackId="a" 
                  fill="#EF4444" 
                  name="Counterfeit"
                  onClick={(data) => handleCategoryClick(data.name)}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Market Share */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Verification Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      onClick={() => handleCategoryClick(entry.name)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<VerificationTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedView === 'performance' && (
        <div className="space-y-8">
          {/* Performance Metrics */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Performance Metrics</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip content={<PerformanceTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="authenticityRate" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Authenticity Rate (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="avgConfidence" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Avg Confidence (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Engagement */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Customer Engagement by Category</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip content={<PerformanceTooltip />} />
                <Bar dataKey="customerCount" fill="#8B5CF6" name="Customer Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedView === 'details' && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-800">
            Detailed Analytics
            {selectedCategory && ` - ${selectedCategory}`}
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verifications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Authentic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Counterfeit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auth Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recent Activity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedCategory === item.name ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleCategoryClick(item.name)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.verifications.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {item.authentic.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {item.counterfeit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                      {item.customerCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.authenticityRate >= 90 
                          ? 'bg-green-100 text-green-800'
                          : item.authenticityRate >= 70
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.authenticityRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.avgConfidence >= 90 
                          ? 'bg-green-100 text-green-800'
                          : item.avgConfidence >= 70
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.avgConfidence.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">{item.recentVerifications}</div>
                        <div className="ml-2">
                          {item.recentVerifications > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Idle
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};