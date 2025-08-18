// Login Component
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Shield, Eye, EyeOff, LogIn } from "lucide-react";

 const LoginScreen: React.FC<{ onSwitchToSignup: () => void }> = ({ onSwitchToSignup }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');
   const { login, loading } = useAuth();

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
const success = await login(email, password);
     if (!success) {
       setError('Invalid credentials. Please try again.');
     }
   };

   return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
         <div className="text-center mb-8">
           <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
           <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
           <p className="text-gray-600 mt-2">Access your verification dashboard</p>
         </div>
  <form onSubmit={handleSubmit} className="space-y-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Email Address
             </label>
             <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               placeholder="Enter your email"
               required
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Password
             </label>
             <div className="relative">
               <input
                 type={showPassword ? 'text' : 'password'}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                 placeholder="Enter your password"
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
               >
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
             </div>
           </div>

           {error && (
             <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
               {error}
             </div>
           )}

           <button
             type="submit"
             disabled={loading}
             className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

         <div className="text-center mt-6 pt-4 border-t border-gray-200">
           <p className="text-gray-600">
             Don't have an account?{' '}
             <button
               onClick={onSwitchToSignup}
               className="text-indigo-600 hover:text-indigo-700 font-medium"
             >
               Sign up
             </button>
           </p>
           <p className="text-xs text-gray-500 mt-2">
             Demo credentials: test@example.com / password
           </p>
         </div>
       </div>
     </div>
   );
 };
 export default LoginScreen;
