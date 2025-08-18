import React, { useState,  } from 'react';
import { AuthProvider } from '../context/AuthContext';
import AuthWrapper from './components/AuthWraper';



// // GraphQL Queries and Mutations (Mock implementation)
// const graphqlClient = {
//   query: async (query: string, variables?: any) => {
//     // Mock GraphQL implementation
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     if (query.includes('login')) {
//       if (variables.email === 'test@example.com' && variables.password === 'password') {
//         return {
//           data: {
//             login: {
//               access_token: 'mock_token_' + Date.now(),
//               user: {
//                 id: '1',
//                 email: variables.email,
//                 role: 'manufacturer',
//                 wallet_address: '0x1234567890123456789012345678901234567890',
//                 created_at: new Date().toISOString()
//               }
//             }
//           }
//         };
//       }
//       throw new Error('Invalid credentials');
//     }
    
//     if (query.includes('signup')) {
//       return {
//         data: {
//           signup: {
//             success: true,
//             message: 'Account created successfully'
//           }
//         }
//       };
//     }
    
//     if (query.includes('getProducts')) {
//       return {
//         data: {
//           products: [
//             {
//               _id: '1',
//               serial_number: 'SN001',
//               product_name: 'Premium Widget',
//               category: 'Electronics',
//               description: 'High-quality electronic widget',
//               manufacturer_id: '1',
//               manufacturer_address: '0x1234567890123456789012345678901234567890',
//               blockchain_tx_hash: '0xabc123...',
//               registered_at: new Date().toISOString(),
//               verified: true
//             }
//           ]
//         }
//       };
//     }
    
//     if (query.includes('getApiKeys')) {
//       return {
//         data: {
//           apiKeys: [
//             {
//               _id: '1',
//               label: 'Production API',
//               masked_key: 'pk_live_****...****abcd',
//               created_at: new Date().toISOString(),
//               last_used: new Date().toISOString(),
//               usage_count: 150
//             }
//           ]
//         }
//       };
//     }
    
//     if (query.includes('registerProduct')) {
//       return {
//         data: {
//           registerProduct: {
//             success: true,
//             product: {
//               _id: Date.now().toString(),
//               ...variables.product,
//               blockchain_tx_hash: '0x' + Math.random().toString(16).substr(2, 8),
//               registered_at: new Date().toISOString(),
//               verified: true
//             }
//           }
//         }
//       };
//     }
    
//     if (query.includes('createApiKey')) {
//       return {
//         data: {
//           createApiKey: {
//             success: true,
//             apiKey: {
//               _id: Date.now().toString(),
//               label: variables.label,
//               key: 'pk_live_' + Math.random().toString(36).substr(2, 32),
//               masked_key: 'pk_live_****...****' + Math.random().toString(36).substr(2, 4),
//               created_at: new Date().toISOString(),
//               usage_count: 0
//             }
//           }
//         }
//       };
//     }
    
//     return { data: {} };
//   }
// };



//       setLoading(false);
//     }
//   };



// Main App Component
const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthProvider>
      <AuthWrapper isLogin={isLogin} setIsLogin={setIsLogin} />
    </AuthProvider>
  );
};

// const AuthWrapper: React.FC<{ isLogin: boolean; setIsLogin: (value: boolean) => void }> = ({ isLogin, setIsLogin }) => {
//   const { user } = useAuth();

//   if (user) {
//     return <Dashboard />;
//   }

//   if (isLogin) {
//     return <LoginScreen onSwitchToSignup={() => setIsLogin(false)} />;
//   }

//   return <SignupScreen onSwitchToLogin={() => setIsLogin(true)} />;
// };

export default App