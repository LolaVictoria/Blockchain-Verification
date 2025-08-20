import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLogin: React.FC = () => {
  const { state, actions } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  }); 
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        actions.resetError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error, actions]);

  // Check if user is locked out due to too many attempts
  const isLockedOut = state.loginAttempts >= 5;
  const remainingAttempts = Math.max(0, 5 - state.loginAttempts);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLockedOut) return;
    
    await actions.login({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (state.error) {
      actions.resetError();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-blue-200">Secure access to administrative dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Error Message */}
          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <div className="text-sm text-red-800">
                {state.error}
                {!isLockedOut && remainingAttempts > 0 && (
                  <div className="text-xs mt-1 text-red-600">
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lockout Warning */}
          {isLockedOut && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-yellow-600 mr-3" />
                <div className="text-sm text-yellow-800">
                  <strong>Account temporarily locked</strong>
                  <p className="mt-1">Too many failed attempts. Please contact system administrator.</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={state.isLoading || isLockedOut}
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={state.isLoading || isLockedOut}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={state.isLoading || isLockedOut}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={state.isLoading || isLockedOut}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Keep me signed in
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={state.isLoading || isLockedOut || !formData.email || !formData.password}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center text-xs text-gray-500">
              <p>Secure administrative access only</p>
              <p className="mt-1">Contact IT support for account issues</p>
            </div>
          </div>
        </div>

        {/* Development Info (remove in production) */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg text-white text-xs">
            <p className="font-medium mb-2">Development Mode:</p>
            <p>RPC Auth: {import.meta.env.VITE_USE_RPC_AUTH === 'true' ? 'Enabled' : 'Disabled'}</p>
            <p>Endpoint: {import.meta.env.VITE_ENDPOINT}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;