// components/customer/CounterfeitReportsTable.tsx
import type { CounterfeitReport } from '../../../utils/AnalyticsService';

interface Props {
  reports: CounterfeitReport[];
}

export const CounterfeitReportsTable = ({ reports }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 overflow-y-scroll">
      <h3 className="text-xl font-semibold mb-4">Counterfeit Reports</h3>
      {reports.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{report.serialNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.storeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.purchaseDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">NGN {report.purchasePrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No counterfeit reports available
        </div>
      )}
    </div>
  );
};
