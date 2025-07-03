import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Floating Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-primary-500 to-indigo-500 h-3 w-full" />
          
          {/* Content Container */}
          <div className="p-8 sm:p-10">
            {/* Branding Section */}
            <div className="flex flex-col items-center mb-8">
              <Link to="/" className="mb-4 transition-transform hover:scale-105">
                <div className="bg-gradient-to-r from-primary-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-md">
                  <div className="text-white font-bold text-xl">RR</div>
                </div>
              </Link>
              
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                ReferralRewards Pro
              </h2>
              
              <p className="mt-2 text-center text-gray-600 max-w-xs">
                The ultimate referral tracking and rewards system
              </p>
            </div>
            
            {/* Form Content */}
            {children}
            
            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center space-x-4">
              <Link 
                to="/terms" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Terms
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                to="/privacy" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Privacy
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                to="/help" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
        
        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 group transition-colors"
          >
            <svg 
              className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;