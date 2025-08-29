// import React, { useEffect } from 'react';
// import { Shield, LogOut, User } from 'lucide-react';
// import { AdminProvider, useAdminContext } from '../../context/AdminContext';
// import AdminLogin from '../pages/adminLogin';
// import StatsCards from '../components/adminDashboard/statCards';
// import MessageAlert from '../components/adminDashboard/messageAlert';
// import NavigationTabs from '../components/adminDashboard/auditsLogTable';
// import SearchAndActions from '../components/adminDashboard/searchAndActions';
// import PendingManufacturersTable from '../components/adminDashboard/pendingManufacturersTable';
// import AuthorizedManufacturersTable from '../components/adminDashboard/authorizedManufacturerTable';
// import AuditLogsTable from '../components/adminDashboard/auditsLogTable';
// import LoadingSpinner from '../components/layout/loadingSpinner';
// import { useAdminAuth, AdminAuthProvider} from '../../context/AdminAuthContext';

// const AdminHeader: React.FC = () => {
//   const { state: authState, actions: authActions } = useAdminAuth();

//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       authActions.logout();
//     }
//   };

//   return (
//     <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//               <Shield className="mr-3 text-blue-600" size={32} />
//               Admin Dashboard
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Manage manufacturer authorizations and system oversight
//             </p>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {/* Admin Info */}
//             <div className="flex items-center text-sm text-gray-600">
//               <User className="w-4 h-4 mr-2" />
//               <span>{authState.admin?.email}</span>
//             </div>
            
//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//             >
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboardContent: React.FC = () => {
//   const { state, actions } = useAdminContext();
//   const { activeTab, loading } = state;

//   // Load data on component mount
//   useEffect(() => {
//     actions.loadData();
//   }, []);

//   const renderTabContent = () => {
//     if (loading) {
//       return <LoadingSpinner message="Loading data..." />;
//     }

//     switch (activeTab) {
//       case 'pending':
//         return <PendingManufacturersTable />;
//       case 'authorized':
//         return <AuthorizedManufacturersTable />;
//       case 'audit':
//         return <AuditLogsTable />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header with logout */}
//       <AdminHeader />
      
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Stats Cards */}
//         <StatsCards />

//         {/* Message Alert */}
//         <MessageAlert />

//         {/* Main Content Container */}
//         <div className="bg-white rounded-lg shadow-sm mb-6">
//           {/* Navigation Tabs */}
//           <NavigationTabs />

//           {/* Search and Actions */}
//           <SearchAndActions />
//         </div>

//         {/* Tab Content */}
//         {renderTabContent()}
//       </div>
//     </div>
//   );
// };

// const AuthenticatedAdminDashboard: React.FC = () => {
//   const { state: authState } = useAdminAuth();

//   // Show login if not authenticated
//   if (!authState.isAuthenticated) {
//     return <AdminLogin />;
//   }

//   // Show dashboard if authenticated
//   return (
//     <AdminProvider>
//       <AdminDashboardContent />
//     </AdminProvider>
//   );
// };

// const AdminDashboard: React.FC = () => {
//   return (
//     <AdminAuthProvider>
//       <AuthenticatedAdminDashboard />
//     </AdminAuthProvider>
//   );
// };

// export default AdminDashboard;