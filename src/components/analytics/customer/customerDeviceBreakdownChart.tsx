import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Customer Device Breakdown Interface
interface CustomerDeviceBreakdown {
  name: string;
  count: number;
  authentic: number;
  counterfeit: number;
  color?: string;
  deviceNames?: string[];
}

interface CustomerDeviceBreakdownProps {
  data: CustomerDeviceBreakdown[];
  loading?: boolean;
  error?: string | null;
}

// Custom colors for charts
const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-medium">{`Device: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Device names tooltip for pie chart
const DeviceNamesTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg max-w-xs">
        <p className="font-medium">{`${data.name}: ${data.value} devices`}</p>
        <p className="text-sm text-gray-600">Authentic: {data.authentic}</p>
        <p className="text-sm text-gray-600">Counterfeit: {data.counterfeit}</p>
        {data.deviceNames && data.deviceNames.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium">Device Names:</p>
            <ul className="text-xs text-gray-500 mt-1">
              {data.deviceNames.slice(0, 5).map((name: string, idx: number) => (
                <li key={idx}>• {name}</li>
              ))}
              {data.deviceNames.length > 5 && (
                <li className="italic">...and {data.deviceNames.length - 5} more</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const CustomerDeviceBreakdownComponent: React.FC<CustomerDeviceBreakdownProps> = ({
  data,
  loading = false,
  error = null
}) => {
  // Prepare data for pie chart
  const pieData = data.map((item, index) => ({
    ...item,
    value: item.count,
    color: item.color || COLORS[index % COLORS.length]
  }));

  // Prepare data for bar chart
  const barData = data.map(item => ({
    ...item,
    total: item.count
  }));

  // Calculate totals for summary
  const totalDevices = data.reduce((sum, item) => sum + item.count, 0);
  const totalAuthentic = data.reduce((sum, item) => sum + item.authentic, 0);
  const totalCounterfeit = data.reduce((sum, item) => sum + item.counterfeit, 0);
  const authenticityRate = totalDevices > 0 ? ((totalAuthentic / totalDevices) * 100).toFixed(1) : 0;

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
          <p className="font-medium">Error loading device breakdown</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="text-gray-500 text-center py-8">
          <p className="font-medium">No device data available</p>
          <p className="text-sm mt-1">Start verifying devices to see your breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Device Portfolio</h3>
        <p className="text-gray-600">Overview of your verified device categories</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalDevices}</div>
          <div className="text-sm text-blue-800">Total Devices</div>
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
          <div className="text-2xl font-bold text-purple-600">{authenticityRate}%</div>
          <div className="text-sm text-purple-800">Authentic Rate</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-y-6">
        {/* Pie Chart - Device Distribution */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Device Category Distribution</h4>
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<DeviceNamesTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stacked Bar Chart - Authentic vs Counterfeit */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Authenticity Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="authentic" stackId="a" fill="#10B981" name="Authentic" radius={[0, 0, 4, 4]} />
              <Bar dataKey="counterfeit" stackId="a" fill="#EF4444" name="Counterfeit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Categories Table */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">Detailed Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Authentic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Counterfeit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => {
                const successRate = item.count > 0 ? ((item.authentic / item.count) * 100).toFixed(1) : 0;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {item.authentic}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {item.counterfeit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parseFloat(successRate as string) >= 90 
                          ? 'bg-green-100 text-green-800'
                          : parseFloat(successRate as string) >= 70
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {successRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};