// src/pages/public/ForgotPassword.jsx
import React, { useState } from 'react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/ui/Button';
import { forgotPassword } from '../../services/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Pass email string directly, not as an object
      await forgotPassword(email);
      setMessage('Password reset email sent. Please check your inbox.');
      toast.success('Password reset email sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message ? (
            <div className="text-center">
              <div className="mb-4 text-green-600">{message}</div>
              <Button 
                variant="primary" 
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 input-field"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full" 
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/login')}
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              <FiArrowLeft className="mr-1 h-4 w-4" />
              Back to login
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;