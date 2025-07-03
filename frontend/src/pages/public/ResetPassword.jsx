import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiLock, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/ui/Button';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import { resetPassword } from '../../services/auth';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const { token: urlToken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  
  // Decode the URL-encoded token
  const token = decodeURIComponent(urlToken || '');

  useEffect(() => {
    // Validate token structure
    if (!token || token.split('.').length !== 3) {
      setIsValidToken(false);
      toast.error('Invalid or expired reset token');
    }
  }, [token]);

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 characters with a letter, number, and special character');
      return false;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidToken) {
      toast.error('Invalid reset token');
      return;
    }
    
    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      toast.success('Password reset successful! You can now log in with your new password');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <AuthLayout>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <FiAlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
            <p className="mt-2 text-gray-600">
              The password reset link is invalid or has expired. Please request a new reset link.
            </p>
            <div className="mt-6">
              <Button 
                variant="primary" 
                onClick={() => navigate('/forgot-password')}
              >
                Request New Reset Link
              </Button>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Set a New Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create a strong password to secure your account
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
              />
              
              {password && (
                <PasswordStrengthIndicator password={password} />
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input-field w-full"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
              />
            </div>

            {passwordError && (
              <div className="text-red-500 text-sm">
                {passwordError}
              </div>
            )}

            <div>
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full" 
                isLoading={isLoading}
              >
                Reset Password
              </Button>
            </div>
          </form>

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

export default ResetPassword;