// Main Dashboard Component
import { useAuth } from "../hooks/useAuth";
import { Shield, LogOut } from "lucide-react";
import ManufacturerDashboard from "./ManufacturerDashboard";
// import DeveloperDashboard from "./developerDashboard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerDashboard from "./customerDahboard";

const Dashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user, logout } = useAuth(); 
  const { role, id } = useParams<{ role: string; id: string }>();

  useEffect(() => {
    if (user) {
      // context already has user
      setUserRole(user.role);
    }
  }, [user, role, id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Product Verification</h1>
                <p className="text-sm text-gray-500 capitalize">{userRole} Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {userRole === "manufacturer" && user?.wallet_verification_status && (
                <div className="flex flex-col gap-y-1 justify-center">
                  <p className="text-lg font-medium">Wallet Status</p>
                  <div
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      user?.wallet_verification_status === "verified"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <p>{user.wallet_verification_status}</p>
                  </div>
                </div>
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.primary_email}</p>
                {user?.primary_wallet && (
                  <p className="text-xs text-gray-500 font-mono">
                    {user.primary_wallet.slice(0, 6)}...{user.primary_wallet.slice(-4)}
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
        {userRole === "manufacturer" && <ManufacturerDashboard />}

        {userRole === "customer" && <CustomerDashboard /> }
      </main>
    </div>
  );
};

export default Dashboard;
