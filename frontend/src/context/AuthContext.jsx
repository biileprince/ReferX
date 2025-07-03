// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { login, logout, getCurrentUser, register, verifyEmail, refreshToken } from '../services/auth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

useEffect(() => {
  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      // Always try to get current user if token exists
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          // Try to refresh token only if it's an auth error
          if (error.message === 'Unauthorized') {
            try {
              const newToken = await refreshToken();
              localStorage.setItem('token', newToken);
              
              // Retry getting current user
              const userData = await getCurrentUser();
              setUser(userData);
              setIsAuthenticated(true);
              localStorage.setItem('user', JSON.stringify(userData));
            } catch (refreshError) {
              console.error('Token refresh failed', refreshError);
              handleLogout();
            }
          } else {
            console.error('Error getting current user', error);
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error', error);
    } finally {
      setLoading(false);
    }
  };

  initializeAuth();
}, [handleLogout]);

  const loginUser = useCallback(async (credentials) => {
    try {
      const response = await login(credentials);
      
      // Store tokens
      localStorage.setItem('token', response.token);
   
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
    }
  }, [handleLogout]);

  const registerUser = useCallback(async (userData) => {
    try {
      const response = await register(userData);
      toast.success('Verification email sent! Please check your inbox');
      return response;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  }, []);

  const updateAuthUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const verifyUserEmail = useCallback(async (token) => {
    try {
      const response = await verifyEmail(token);
      return response;
    } catch (error) {
      console.error('Email verification failed', error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login: loginUser,
        logout: logoutUser,
        register: registerUser,
        verifyEmail: verifyUserEmail,
        updateAuthUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);