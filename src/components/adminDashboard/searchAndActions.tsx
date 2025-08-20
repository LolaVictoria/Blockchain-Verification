import React from 'react';
import { Search, RefreshCw, Shield } from 'lucide-react';
import { useAdminContext } from '../../../context/AdminContext';

const SearchAndActions: React.FC = () => {
  const { state, actions } = useAdminContext();
  const { 
    activeTab, 
    searchTerm, 
    loading, 
    authorizationLoading, 
    selectedManufacturers, 
    pendingManufacturers 
  } = state;

  const handleBatchAuthorize = () => {
    actions.batchAuthorizeManufacturers(selectedManufacturers);
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search manufacturers..."
            value={searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={actions.refreshData}
            disabled={loading}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          {activeTab === 'pending' && (
            <>
              <button
                onClick={actions.selectAllManufacturers}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {selectedManufacturers.length === pendingManufacturers.length ? 'Deselect All' : 'Select All'}
              </button>
              
              <button
                onClick={handleBatchAuthorize}
                disabled={selectedManufacturers.length === 0 || authorizationLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authorizationLoading ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield size={16} className="mr-2" />
                    Authorize Selected ({selectedManufacturers.length})
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndActions;