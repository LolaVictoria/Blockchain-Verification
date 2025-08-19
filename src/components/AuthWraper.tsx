import { useAuth } from "../hooks/useAuth";
import Dashboard from "../pages/dashboard";

const AuthWrapper: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Dashboard />;
  }

};
export default AuthWrapper;