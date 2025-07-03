// src/components/dashboard/Header.jsx
import React from 'react';
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useAuth();
  const Navigate=useNavigate();

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button className="md:hidden mr-3 p-2 rounded-md text-gray-500 hover:bg-gray-50">
              <FiMenu className="h-5 w-5" />
            </button>
            <div className="relative max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-50 focus:outline-none">
              <FiBell className="h-5 w-5" />
              <span className="sr-only">View notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-100 to-indigo-100 flex items-center justify-center text-primary-600 font-medium cursor-pointer"
                onClick={()=> Navigate("/profile")}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{user?.name || 'User'}</p>
                <p className="text-xs font-medium text-primary-600 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-1"></span>
                  {user?.points || 0} points
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;