// src/components/auth/PasswordStrengthIndicator.jsx
import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  // Check password criteria
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*#?&]/.test(password);
  
  // Calculate strength score
  const strength = [
    hasMinLength,
    hasLetter,
    hasNumber,
    hasSpecialChar
  ].filter(Boolean).length;
  
  // Strength labels and colors
  const strengthLabels = {
    0: "Very Weak",
    1: "Weak",
    2: "Medium",
    3: "Strong",
    4: "Very Strong"
  };
  
  const strengthColors = {
    0: "bg-red-500",
    1: "bg-red-400",
    2: "bg-yellow-500",
    3: "bg-green-400",
    4: "bg-green-600"
  };
  
  return (
    <div className="mt-3 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ease-out ${strengthColors[strength] || 'bg-red-500'}`}
            style={{ width: `${(strength / 4) * 100}%` }}
          ></div>
        </div>
        <span className="ml-3 text-sm font-medium text-gray-700 min-w-[85px]">
          {strengthLabels[strength]}
        </span>
      </div>
      
      {/* Criteria list */}
      <ul className="space-y-1 text-sm text-gray-600">
        <li className={`flex items-center ${hasMinLength ? 'text-green-600' : ''}`}>
          {hasMinLength ? (
            <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
          At least 8 characters
        </li>
        <li className={`flex items-center ${hasLetter ? 'text-green-600' : ''}`}>
          {hasLetter ? (
            <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
          Contains a letter
        </li>
        <li className={`flex items-center ${hasNumber ? 'text-green-600' : ''}`}>
          {hasNumber ? (
            <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
          Contains a number
        </li>
        <li className={`flex items-center ${hasSpecialChar ? 'text-green-600' : ''}`}>
          {hasSpecialChar ? (
            <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
          Contains a special character (@$!%*#?&)
        </li>
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;