import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import HomePage from './pages/homePage';
import HowItWorksPage from './pages/howItWorks';
import AboutPage from './pages/aboutPage';
import ContactPage from './pages/contactPage';
import LoginScreen from './components/login';
import SignupScreen from './components/signup';
import Dashboard from './pages/dashboard';

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
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;