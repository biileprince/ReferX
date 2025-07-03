// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '../ui/Button';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const RegisterForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  // Check if passwords match
  const passwordsMatch = formData.password === formData.confirmPassword;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="pl-10 input-field"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="pl-10 input-field"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="pl-10 input-field"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            )}
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <PasswordStrengthIndicator password={formData.password} />
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            className="pl-10 input-field"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            )}
          </button>
        </div>
        
        {/* Password match indicator */}
        {formData.confirmPassword && (
          <div className="mt-2 flex items-center">
            {passwordsMatch ? (
              <>
                <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-sm text-green-600">Passwords match</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span className="text-sm text-red-600">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Terms of Service</a> and <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Privacy Policy</a>
        </label>
      </div>
      
      <div>
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full" 
          isLoading={isLoading}
          disabled={!passwordsMatch || formData.password === ''}
        >
          Create Account
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;