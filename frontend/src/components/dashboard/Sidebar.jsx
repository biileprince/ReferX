// src/components/dashboard/Sidebar.jsx
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
  FiBarChart2,
  FiSettings
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
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md text-gray-700 bg-white shadow"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <FiX className="h-6 w-6" />
        ) : (
          <FiMenu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile sidebar */}
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
        } md:static md:flex md:flex-col border-r border-gray-100`}
      >
        <div className="flex flex-col items-center justify-center h-40 px-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-indigo-50">
          <div className="bg-gradient-to-r from-primary-500 to-indigo-500 p-2 rounded-lg shadow">
            <div className="bg-white border-2 border-dashed rounded-lg w-10 h-10 flex items-center justify-center">
              <span className="font-bold text-primary-600">RR</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-xl font-bold text-gray-900">ReferralRewards</span>
            <p className="text-xs text-gray-500 mt-1">Premium Dashboard</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-5 px-4">
          <div className="mb-6 px-3 py-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Account Balance</p>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-primary-600">{user?.points || 0}</span>
              <span className="text-xs text-gray-500 ml-1">points</span>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  location.pathname === item.href
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon 
                  className={`mr-3 h-4 w-4 ${
                    location.pathname === item.href ? 'text-white' : 'text-gray-500'
                  }`} 
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg group"
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