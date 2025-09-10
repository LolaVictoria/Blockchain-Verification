import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { CustomerVerificationHistory } from '../../../utils/AnalyticsService';

interface Props {
  data: CustomerVerificationHistory[];
}

export const VerificationHistoryChart = ({ data }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Your Verification Activity</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
  );
};