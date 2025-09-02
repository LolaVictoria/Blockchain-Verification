// Login Component
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Shield, Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true)
  try {
    await login(email, password);
    setLoginSuccess(true);
  } catch (error) {
    console.error('Login failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    setError(errorMessage);
  }
  setLoading(false)
};

// Navigate when login is successful
useEffect(() => {
  if (loginSuccess && user) {
    navigate(`/dashboard/${user.role}/${user.id}`);
  }
}, [loginSuccess, user, navigate]);


  return (
    <div className="py-20 px-4 min-h-screen bg-gradient-to-br from-blue-900 to-slate-800">
      <div className="max-w-md mx-auto">
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8">
          <div className="text-center mb-8">

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

            <h1 className="text-3xl font-bold text-white mb-2">Log In</h1>
            <p className="text-slate-100">Access your verification dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2">
                Email Address
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

            <div>
              <label className="block text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn size={20} className="mr-2" />
                  Sign In
                </div>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-slate-700">
            <p className="text-slate-100">
              Don't have an account?{' '}
              <Link to="/signup">
              <button
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </button>
              </Link>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Demo credentials: test@example.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;