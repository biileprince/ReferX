// src/pages/public/VerifyEmail.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/ui/Button';
import { FiCheckCircle, FiAlertCircle, FiMail } from 'react-icons/fi';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false); 

  useEffect(() => {

    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyToken = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
      } catch (err) {
        console.error('Verification error:', err);
        
        if (err.message?.includes('new verification email has been sent')) {
          setStatus('resent');
          setMessage(err.message);
        } else {
          setStatus('error');
          setMessage(err.message || 'Email verification failed');
        }
      }
    };

    verifyToken();
  }, [token, verifyEmail]);

  const resendVerification = async () => {
    try {
      setStatus('verifying');
      const response = await verifyEmail(token);
      setStatus('success');
      setMessage(response.message || 'Email verified successfully!');
      toast.success(response.message || 'Email verified successfully!', {
        id: 'resend-success'
      });
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to resend verification');
      toast.error('Failed to resend verification', {
        id: 'resend-error'
      });
    }
  };

  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <h2 className="text-2xl font-bold text-gray-900">Verifying your email</h2>
              <p className="text-gray-600">Please wait while we verify your email address</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <FiCheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {message.includes('already') ? 'Already Verified' : 'Email Verified!'}
              </h2>
              <p className="text-gray-600">
                {message.includes('already')
                  ? 'Your email was already verified. You can log in to your account.'
                  : 'Your email has been successfully verified. You can now log in to your account.'}
              </p>
              <div className="mt-6">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Continue to Login
                </Button>
              </div>
            </div>
          )}

          {status === 'resent' && (
            <div className="space-y-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                <FiMail className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">New Email Sent!</h2>
              <p className="text-gray-600">
                {message || 'A new verification email has been sent to your inbox.'}
              </p>
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-4">
                  Didn't receive the email? Check your spam folder or try resending.
                </p>
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="primary" 
                    onClick={resendVerification}
                  >
                    Resend Verification Email
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/login')}
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <FiAlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
              <p className="text-gray-600">{message || 'The verification link is invalid or has expired'}</p>
              <div className="mt-6 flex flex-col gap-3">
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/register')}
                >
                  Create New Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;