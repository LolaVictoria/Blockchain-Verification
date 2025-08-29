// // pages/CustomerLandingPage.tsx
// import React, { useState, useEffect } from 'react';
// import type { User } from '../../types/auth';
// import authService from '../utils/AuthService';
// import { useProfile } from '../hooks/useProfile';
// import { useAlert } from '../hooks/useAlert';

// // Import customer components
// import { CustomerNavbar } from '../components/customer/CustomerNavbar';
// import { ProductVerificationSection } from '../components/customer/ProductVerificationSection';
// import { UserProfileSection } from '../components/customer/UserProfileSection';
// import { AlertToast } from '../components/manufacturerDashboard/modalComponents';

// const CustomerLandingPage: React.FC = () => {
//   // Use the profile hook for customer
//   const { user, loading: profileLoading, error: profileError, refreshProfile } = useProfile('customer');
  
//   // Local state
//   const [activeSection, setActiveSection] = useState<'verification' | 'profile'>('verification');
  
//   // Alert hook
//   const { alert, showAlert, hideAlert } = useAlert();

//   // Handle profile errors
//   useEffect(() => {
//     if (profileError) {
//       showAlert(`Profile Error: ${profileError}`, 'error');
//     }
//   }, [profileError, showAlert]);

//   // Handle logout
//   const handleLogout = () => {
//     authService.logout();
//     window.location.href = '/login';
//   };

//   // Loading state
//   if (profileLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   // Authentication check
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
//           <p className="text-gray-600 mb-6">
//             {profileError ? profileError : 'You need to be logged in to access this page.'}
//           </p>
//           <a 
//             href="/login" 
//             className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Go to Login
//           </a>
//         </div>
//       </div>
//     );
//   }

//   // Role check (optional - customers might have different roles)
//   if (user.role !== 'customer') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Insufficient Permissions</h1>
//           <p className="text-gray-600 mb-6">This page is only accessible to customers.</p>
//           <button 
//             onClick={handleLogout}
//             className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation */}
//       <CustomerNavbar 
//         user={user} 
//         onRefreshProfile={refreshProfile}
//         activeSection={activeSection}
//         onSectionChange={setActiveSection}
//       />

//       {/* Main Content */}
//       <div className="pt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">
//               Welcome, {user.username}!
//             </h1>
//             <p className="mt-2 text-gray-600">
//               Verify product authenticity and manage your profile.
//             </p>
//           </div>

//           {/* Content Sections */}
//           {activeSection === 'verification' && (
//             <ProductVerificationSection user={user} />
//           )}

//           {activeSection === 'profile' && (
//             <UserProfileSection 
//               user={user} 
//               onRefreshProfile={refreshProfile}
//             />
//           )}
//         </div>
//       </div>

//       {/* Alert Toast */}
//       {alert.isVisible && (
//         <AlertToast
//           message={alert.message}
//           type={alert.type}
//           onClose={hideAlert}
//           isVisible={alert.isVisible}
//         />
//       )}
//     </div>
//   );
// };

// export default CustomerLandingPage;