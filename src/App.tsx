import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Lazy load all page components
const HomePage = lazy(() => import('./pages/homePage'));
const HowItWorksPage = lazy(() => import('./pages/howItWorks'));
const AboutPage = lazy(() => import('./pages/aboutPage'));
const ContactPage = lazy(() => import('./pages/contactPage'));
const LoginScreen = lazy(() => import('./components/auth/login'));
const SignupScreen = lazy(() => import('./components/auth/signup'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const VerifyPage = lazy(() => import('./pages/verify'));
const ProductGrid = lazy(() => import('./components/manufacturerDashboard/productGrid').then(module => ({ default: module.ProductGrid })));


const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading...</span>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/dashboard/:role/:id/products" element={<ProductGrid />} />
            <Route path="/dashboard/:role/:id/" element={<Dashboard />} />
            {/* <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/manufacturer-dashboard" element={<ManufacturerDashboard />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;