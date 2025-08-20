import React from 'react';
import { Clock, Building2, Mail, Wallet, Calendar } from 'lucide-react';
import { useAdminContext } from '../../../context/AdminContext';
import { formatDate, truncateAddress } from '../../utils/helper';

const PendingManufacturersTable: React.FC = () => {
  const { state, actions } = useAdminContext();
  const { pendingManufacturers, selectedManufacturers, searchTerm } = state;

  const filteredManufacturers = pendingManufacturers.filter(manufacturer =>
    manufacturer.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredManufacturers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-12 text-center">
          <Clock className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending manufacturers</h3>
          <p className="text-gray-600">All manufacturers have been processed.</p>
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
                <input
                  type="checkbox"
                  checked={selectedManufacturers.length === pendingManufacturers.length && pendingManufacturers.length > 0}
                  onChange={actions.selectAllManufacturers}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wallet Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredManufacturers.map((manufacturer) => (
              <tr key={manufacturer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedManufacturers.includes(manufacturer.id)}
                    onChange={() => actions.selectManufacturer(manufacturer.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Building2 className="text-gray-400 mr-3" size={20} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {manufacturer.businessName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail size={12} className="mr-1" />
                        {manufacturer.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Wallet className="text-gray-400 mr-2" size={16} />
                    <code className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {truncateAddress(manufacturer.walletAddress)}
                    </code>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-2" size={16} />
                    {formatDate(manufacturer.dateRegistered)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock size={12} className="mr-1" />
                    Pending
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

export default PendingManufacturersTable;