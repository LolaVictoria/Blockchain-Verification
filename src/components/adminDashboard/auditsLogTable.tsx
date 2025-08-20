import React from 'react';
import { Activity, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { useAdminContext } from '../../../context/AdminContext';
import { formatDate, truncateAddress } from '../../utils/helper';

const AuditLogsTable: React.FC = () => {
  const { state } = useAdminContext();
  const { auditLogs } = state;

  if (auditLogs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-12 text-center">
          <Activity className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs</h3>
          <p className="text-gray-600">No administrative actions have been recorded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Shield className="text-blue-600 mr-2" size={16} />
                    <span className="text-sm font-medium text-gray-900">
                      {log.action.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.adminEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {log.manufacturersCount} manufacturer(s)
                  </div>
                  <div className="text-xs text-gray-500">
                    Gas: {log.gasUsed} | TX: {truncateAddress(log.txHash)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(log.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {log.status === 'success' ? (
                      <CheckCircle2 size={12} className="mr-1" />
                    ) : (
                      <XCircle size={12} className="mr-1" />
                    )}
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogsTable;