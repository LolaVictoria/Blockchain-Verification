import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { CustomerDeviceBreakdown } from '../../../utils/AnalyticsService';

interface Props {
  data: CustomerDeviceBreakdown[];
}

export const DeviceBreakdownChart = ({ data }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-y-scroll">
      <h3 className="text-xl font-semibold mb-4">Your Device Types Verified</h3>
      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
         <div className="mt-4 flex flex-row items-center gap-3 overflow-x-auto">
            {data.map((device, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg flex-shrink-0"
                style={{ borderColor: device.color }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: device.color }}></div>
                  <span className="font-medium text-gray-800 mr-0.5">{device.name}: </span>
                </div>
                <div className="text-sm text-gray-600 flex">
                  <span className="font-medium">{device.count}</span> total
                  <span className="text-green-600 ml-2">{device.authentic} authentic</span>
                  <span className="text-red-600 ml-2">{device.counterfeit} counterfeit</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No device data available
        </div>
      )}
    </div>
  );
};