// components/manufacturerDashboard/mdNavbar.tsx
import React, { useState, type Dispatch, type SetStateAction } from 'react';
import { User, LogOut, RefreshCw, Settings, Menu, X, Shield } from 'lucide-react';
import type { User as UserType } from '../../../types/auth';
import authService from '../../utils/AuthService';
import { Link, useNavigate } from 'react-router-dom';

interface CustomerNavbarProps {
  user: UserType;
  onRefreshProfile?: () => Promise<UserType>; 
  setShowEditProfile: Dispatch<SetStateAction<boolean>>
}

export const CustomerNavbar: React.FC<CustomerNavbarProps> = ({ 
  user, 
  onRefreshProfile, 
  setShowEditProfile
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  
  const handleRefreshProfile = async () => {
    if (!onRefreshProfile) return;
    
    setIsRefreshing(true);
    try {
      await onRefreshProfile();
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    } finally {
      setIsRefreshing(false);
    }
  };


  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to={`/dashboard/${user.role}/${user.id}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              VerifyChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="ml-10 flex items-baseline space-x-4">
              <Link to="/">
                <li
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
              >
                Home
              </li>
              </Link>

              <Link to={`/dashboard/${user.role}/${user.id}`}>
                <li className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                  Dashboard
                </li>
              </Link>
    
              <Link to="/verify">
                <li className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Verify Products
                </li>
              </Link>
            </ul>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Refresh Profile Button */}
              {onRefreshProfile && (
                <button
                  onClick={handleRefreshProfile}
                  disabled={isRefreshing}
                  className="mr-3 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  title="Refresh Profile"
                >
                  <RefreshCw 
                    className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} 
                  />
                </button>
              )}

              {/* Profile Dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className=" rounded-full p-0.5  flex items-center justify-center text-sm text-white"
                    id="user-menu-button"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className='flex flex-col items-start gap-y-1'>
                    <span className="ml-2 text-gray-700 font-light text-sm">
                      {user.primary_email}
                    </span>
                    </div>
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {/* User Info */}
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-gray-500">{user.primary_email}</div>
                        <div className="text-xs text-blue-600 capitalize">
                          {user.role}
                        </div>
                      </div>

                      {/* Profile Actions */}
                      <button
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                        onClick={() => {
                          setShowEditProfile(true);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Profile Settings
                      </button>

                      {/* Refresh Profile Option */}
                      {onRefreshProfile && (
                        <button
                          onClick={() => {
                            handleRefreshProfile();
                            setIsDropdownOpen(false);
                          }}
                          disabled={isRefreshing}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <RefreshCw className={`mr-3 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                          {isRefreshing ? 'Refreshing...' : 'Refresh Profile'}
                        </button>
                      )}

                      {/* Logout */}
                      <button
                        onClick={() => {
                          authService.logout()
                          navigate("/")
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu and user profile section */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Refresh Button */}
            {onRefreshProfile && (
              <button
                onClick={handleRefreshProfile}
                disabled={isRefreshing}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 disabled:opacity-50"
                title="Refresh Profile"
              >
                <RefreshCw 
                  className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} 
                />
              </button>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="flex items-center space-x-0.5 px-2 sm:px-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className='flex flex-col items-start gap-y-1'>
              <span className="ml-2 text-gray-700 font-light text-xs">
                {user.primary_email}
              </span>
            </div>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {/* Mobile Navigation Links */}
            <Link to="/">
                <button 
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                    Home
                </button>
            </Link>
            <Link to={`/dashboard/${user.role}/${user.id}`}>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Dashboard
              </button>
            </Link>
            
            <Link to="/verify" className="block">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Verify Products
              </button>
            </Link>

            {/* Mobile Profile Actions */}
            <div className="border-t border-gray-200 mt-3 pt-3">
              <button
                onClick={() => {
                  setShowEditProfile(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                <Settings className="mr-3 h-5 w-5" />
                Profile Settings
              </button>

              <button
                onClick={() => {
                  authService.logout()
                  navigate("/")
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};