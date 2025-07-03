import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Floating Card with subtle animation */}
        <div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated Gradient Header */}
          <div className="relative h-3 w-full overflow-hidden">
            <div 
              className={`absolute inset-0 bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500 transition-all duration-1000 ${
                isHovered ? 'opacity-100' : 'opacity-90'
              }`}
              style={{ 
                backgroundSize: isHovered ? '200% 200%' : '150% 150%',
                backgroundPosition: isHovered ? '100% 100%' : '0% 0%',
                animation: isHovered ? 'gradientPulse 3s ease infinite' : 'none'
              }}
            />
            <style jsx>{`
              @keyframes gradientPulse {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
          </div>
          
          {/* Content Container */}
          <div className="p-8 sm:p-10">
            {/* Branding Section with Animation */}
            <div className="flex flex-col items-center mb-8">
              <Link 
                to="/" 
                className="mb-4 transition-transform duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="bg-gradient-to-r from-primary-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-md">
                    <div className="text-white font-bold text-xl">RX</div>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    β
                  </div>
                </div>
              </Link>
              
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                  ReferX
                </span>
              </h1>
              
              <p className="mt-2 text-center text-gray-600 max-w-xs">
                Smart referral tracking & rewards platform
              </p>
            </div>
            
            {/* Form Content */}
            {children}
            
            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link 
                to="/terms" 
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200 text-center"
              >
                Terms
              </Link>
              <span className="hidden sm:inline text-gray-300">•</span>
              <Link 
                to="/privacy" 
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200 text-center"
              >
                Privacy
              </Link>
              <span className="hidden sm:inline text-gray-300">•</span>
              <Link 
                to="/help" 
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200 text-center"
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
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 group transition-colors duration-200"
          >
            <svg 
              className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" 
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