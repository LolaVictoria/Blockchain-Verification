// pages/ManufacturerDashboard.tsx
import React, {  useEffect, useState } from 'react';
import EditProfile from '../components/manufacturerDashboard/editProfile';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CustomerNavbar } from '../components/customerDashboard/customerNavbar';
import { useAlert } from '../hooks/useAlert';
// import CustomerAnalyticsDashboard from '../components/analytics/customerAnalytics';
import useAuth from '../hooks/useAuth';

const CustomerDashboard: React.FC = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate();
  const {refreshProfile, loading: profileLoading, error: profileError } = useAuthContext()
 const { user } = useAuth()
  
  const { 
    // alert, 
    showAlert, 
    // hideAlert 
  } = useAlert();
  
  
  
  // Handle profile errors
  useEffect(() => {
    if (profileError) {
      showAlert(`Profile Error: ${profileError}`, 'error');
    }
  }, [profileError, showAlert]);

  // Handle role-based navigation
  useEffect(() => {
    if (user && user.role !== 'customer') {
      navigate("/");
    }
  }, [user, navigate]);

  
  // Handle loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Handle no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            {profileError ? profileError : 'You need to be logged in as a Customer to access this page.'}
          </p>
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Handle wrong role - show loading while redirecting
  if (user && user.role !== 'customer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <CustomerNavbar 
        user={user} 
        onRefreshProfile={refreshProfile} 
        setShowEditProfile={setShowEditProfile}
      />

      {/* Main Content */}
      <div className="pt-16"> {/* Account for fixed navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Customer Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back, <span className="font-semibold">{user.primary_email}</span>! Protect yourself from counterfeits with instant product authentication with secure blockchain verification.
            </p>
          </div>

         

          {/* <CustomerAnalyticsDashboard /> */}
        </div>
      </div>

     
      

     
      {showEditProfile && (
        <EditProfile
          onClose={() => setShowEditProfile(false)}
          userRole={user.role}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;