import type { VerificationLog } from '../../../utils/AnalyticsService';

interface Props {
  logs: VerificationLog[];
}

export const VerificationLogsTable = ({ logs }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 overflow-x-scroll">
      <h3 className="text-xl font-semibold mb-4">Recent Verification Logs</h3>
      {logs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{log.serialNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.deviceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.deviceCategory}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      log.status === 'Authentic' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.time}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.confidence}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.verificationMethod}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No verification logs available
        </div>
      )}
    </div>
  );
};