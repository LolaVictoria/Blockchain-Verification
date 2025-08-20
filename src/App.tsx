import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import HomePage from './pages/homePage';
import HowItWorksPage from './pages/howItWorks';
import AboutPage from './pages/aboutPage';
import ContactPage from './pages/contactPage';
import LoginScreen from './components/auth/login';
import SignupScreen from './components/auth/signup';
import Dashboard from './pages/dashboard';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin';

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen/>} />
          <Route path="/dashboard/:role/:id/" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;