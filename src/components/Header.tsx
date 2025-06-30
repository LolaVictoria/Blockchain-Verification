import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState('customer');

  const isActive = (path: string) => location.pathname === path;

  const getDashboardPath = () => {
    switch (userRole) {
      case 'admin': return '/admin';
      case 'manufacturer': return '/manufacturer';
      default: return '/verify';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-security-blue rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VeriTrace</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to={getDashboardPath()}
              className={`text-sm font-medium transition-colors ${
                isActive(getDashboardPath()) ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/verify"
              className={`text-sm font-medium transition-colors ${
                isActive('/verify') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Verify Product
            </Link>
            <Link
              to="/extension-demo"
              className={`text-sm font-medium transition-colors ${
                isActive('/extension-demo') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Extension Demo
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors ${
                isActive('/contact') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Role Selector and Actions */}
          <div className="flex items-center space-x-4">
            <Select value={userRole} onValueChange={setUserRole}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="bg-security-blue hover:bg-blue-700">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
