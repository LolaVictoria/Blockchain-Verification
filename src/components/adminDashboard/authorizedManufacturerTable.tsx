import React from 'react';
import { CheckCircle2, Eye, XCircle } from 'lucide-react';
import { useAdminContext } from '../../../context/AdminContext';
const AuthorizedManufacturersTable: React.FC = () => {
  const { state } = useAdminContext();
  const { authorizedManufacturers, searchTerm } = state;

  const filteredManufacturers = authorizedManufacturers.filter(manufacturer =>
    manufacturer.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredManufacturers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-12 text-center">
          <CheckCircle2 className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No authorized manufacturers</h3>
          <p className="text-gray-600">No manufacturers have been authorized yet.</p>
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
                Business Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wallet Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Authorization Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredManufacturers.map((manufacturer) => (
              <tr key={manufacturer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <XCircle size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthorizedManufacturersTable;
           