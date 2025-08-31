import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Assuming you have this hook

interface EmailVerificationProps {
  email: string;
  onClose: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onClose }) => {
  const { resendVerificationEmail, loading, error, clearError } = useAuth();
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResendEmail = async () => {
    if (cooldown > 0) return;
    
    clearError();
    const success = await resendVerificationEmail(email);
    
    if (success) {
      setResendSuccess(true);
      setCooldown(60); // 60 second cooldown
      
      // Start countdown
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-white opacity-50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Check Your Email
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            We've sent a verification link to:
          </p>
          
          <p className="text-sm font-medium text-gray-900 mb-6">
            {email}
          </p>
          
          <p className="text-xs text-gray-500 mb-6">
            Click the link in your email to verify your account. You won't be able to log in until your email is verified.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {resendSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Verification email sent successfully! Please check your inbox.
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={loading || cooldown > 0}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                loading || cooldown > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading
                ? 'Sending...'
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : 'Resend Verification Email'
              }
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              I'll verify later
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>Didn't receive the email? Check your spam folder.</p>
            <p className="mt-1">
              Having trouble?{' '}
              <a href="mailto:support@yourapp.com" className="text-blue-600 hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;