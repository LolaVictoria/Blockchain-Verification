// Main Dashboard Component
import { useAuth } from "../hooks/useAuth";
import { Shield } from "lucide-react";
import { LogOut } from "lucide-react";
import ManufacturerDashboard from "./ManufacturerDashboard";
import DeveloperDashboard from "./developerDashboard";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Product Verification</h1>
                <p className="text-sm text-gray-500 capitalize">{user?.role} Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                {user?.wallet_address && (
                  <p className="text-xs text-gray-500 font-mono">
                    {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
                  </p>
                )}
              </div>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'manufacturer' ? <ManufacturerDashboard /> : <DeveloperDashboard />}
      </main>
    </div>
  );
};
export default Dashboard