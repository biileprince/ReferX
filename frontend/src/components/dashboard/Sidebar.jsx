import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiAward, 
  FiUser, 
  FiLogOut,
  FiMenu,
  FiX,
  FiStar
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Referrals', href: '/referrals', icon: FiUsers },
    { name: 'Rewards', href: '/rewards', icon: FiAward },
    { name: 'Profile', href: '/profile', icon: FiUser },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md text-gray-700 bg-white shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <FiX className="h-6 w-6" />
        ) : (
          <FiMenu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-10 bg-gray-800 bg-opacity-50 backdrop-blur-sm md:hidden transition-opacity ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gradient-to-b from-white to-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:flex md:flex-col border-r border-gray-100 flex flex-col`}
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center h-40 px-4 bg-gradient-to-r from-primary-500 to-indigo-600 pt-6">
          <div className="bg-white p-1 rounded-full shadow-lg mb-3">
            <div className="bg-gradient-to-r from-primary-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">RX</span>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">ReferX Dashboard</h1>
            <p className="text-xs text-indigo-200 mt-1">Smart Referral Tracking</p>
          </div>
          
          <div className="mt-3 flex items-center justify-center bg-white bg-opacity-20 rounded-full px-3 py-1 mb-3">
            <FiStar className="text-yellow-300 mr-1" />
            <span className="text-white text-sm font-medium">{user?.points || 0} points</span>
          </div>
        </div>
        
        {/* User Info */}
        <div className="px-4 py-3 flex items-center justify-center border-b border-gray-100">
          <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-medium text-gray-700">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{user?.name || 'User'}</p>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-5 px-3">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === item.href
                    ? 'bg-primary-100 text-primary-600 shadow-sm border-l-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 ${
                    location.pathname === item.href ? 'text-primary-500' : 'text-gray-500'
                  }`} 
                />
                {item.name}
                {location.pathname === item.href && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary-500"></div>
                )}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg group transition-colors duration-200"
          >
            <FiLogOut className="mr-2 h-4 w-4 text-gray-500 group-hover:text-red-500" />
            <span className="group-hover:text-red-600">Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;