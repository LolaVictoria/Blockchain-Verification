import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Mail, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom';

const SignupScreen: React.FC = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'manufacturer' | 'developer' | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { signup, loading, error, setError, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  
  const onSwitchToLogin = () => {
    navigate('/login'); 
  };

  const validateForm = (): boolean => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    if (role === 'manufacturer' && !walletAddress.trim()) {
      setError('Wallet address is required for manufacturers');
      return false;
    }

    if (role === 'manufacturer' && !walletAddress.startsWith('0x')) {
      setError('Please enter a valid wallet address starting with 0x');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    const result = await signup(
      username.trim(), 
      email.trim().toLowerCase(), 
      password, 
      role!, 
      role === 'manufacturer' ? walletAddress.trim() : undefined
    );

    if (result.success && result.needsVerification) {
      setSuccess(true);
      setSuccessMessage(result.message || 'Registration successful! Please check your email for verification.');
      setShowEmailVerification(true);
      
      // Reset form
      setUserName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setWalletAddress('');
      setRole(null);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    
    const result = await resendVerificationEmail(email);
    if (result.success) {
      setSuccessMessage(result.message || 'Verification email sent successfully!');
    }
  };

  // Email Verification Success Screen
  if (showEmailVerification) {
    return (
      <div className="py-20 px-4 min-h-screen bg-gradient-to-br from-blue-900 to-slate-800">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-8">
              <Link to="/">
                <button className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                    <Shield className="w-9 h-9 text-white" />
                  </div>
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    VerifyChain
                  </span>
                </button>
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">Check Your Email</h1>
              
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg mb-6">
                <p className="text-green-400 text-sm">
                  {successMessage}
                </p>
              </div>

             {success && <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                <CheckCircle />
                We've sent a verification link to <strong className="text-white">{email}</strong>. 
                Click the link in the email to verify your account and complete registration.
              </p>}

              <div className="space-y-4">
                <button
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full bg-slate-700 border border-slate-600 hover:border-blue-400 rounded-lg py-3 text-white hover:bg-slate-600 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowEmailVerification(false);
                    onSwitchToLogin();
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  Continue to Login
                </button>
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg mt-4">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 min-h-screen bg-gradient-to-br from-blue-900 to-slate-800">
      <div className="max-w-md mx-auto">
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <Link to="/">
              <button className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Shield className="w-9 h-9 text-white" />
                </div>
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  VerifyChain
                </span>
              </button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Sign Up</h1>
            <p className="text-slate-100">Join VerifyChain today</p>
          </div>
          
          {!role ? (
            <div className="space-y-4">
              <p className="text-slate-200 text-center mb-6">I am a:</p>
              <button 
                onClick={() => setRole('manufacturer')}
                className="w-full bg-slate-700 border border-slate-600 hover:border-blue-400 rounded-lg p-4 text-left text-white hover:bg-slate-600 transition-all"
              >
                <div className="font-semibold">Manufacturer</div>
                <div className="text-sm text-slate-200">Register and verify products on blockchain</div>
                <div className="text-xs text-slate-400 mt-1">Requires wallet address verification</div>
              </button>
              <button 
                onClick={() => setRole('developer')}
                className="w-full bg-slate-700 border border-slate-600 hover:border-blue-400 rounded-lg p-4 text-left text-white hover:bg-slate-600 transition-all"
              >
                <div className="font-semibold">Developer</div>
                <div className="text-sm text-slate-200">Build verification solutions using our API</div>
                <div className="text-xs text-slate-400 mt-1">Instant access after email verification</div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-4">
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  {role === 'manufacturer' ? 'Manufacturer' : 'Developer'} Account
                </span>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                  placeholder="Enter your username"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>             
              
              <div>
                <label className="block text-slate-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {role === 'manufacturer' && (
                <div>
                  <label className="block text-slate-300 mb-2">
                    Wallet Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    placeholder="0x..."
                    required={role === 'manufacturer'}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Your wallet will be used for product registration and verification
                  </p>
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none pr-12"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => setRole(null)}
                className="w-full text-slate-400 hover:text-white transition-colors"
              >
                ← Back to account type
              </button>
            </form>
          )}

          <div className="text-center mt-6 pt-4 border-t border-slate-700">
            <p className="text-slate-100">
              Already have an account?{' '}
              <Link to="/login">
                <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign in
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;