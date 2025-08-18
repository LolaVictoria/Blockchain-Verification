import { useAuth } from "../hooks/useAuth";
import Dashboard from "../pages/dashboard";
import LoginScreen from "./login";
import SignupScreen from "./signup";

const AuthWrapper: React.FC<{ isLogin: boolean; setIsLogin: (value: boolean) => void }> = ({ isLogin, setIsLogin }) => {
  const { user } = useAuth();

  if (user) {
    return <Dashboard />;
  }

  if (isLogin) {
    return <LoginScreen onSwitchToSignup={() => setIsLogin(false)} />;
  }

  return <SignupScreen onSwitchToLogin={() => setIsLogin(true)} />;
};
export default AuthWrapper;