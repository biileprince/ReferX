// src/services/api.js
import axios from 'axios';

// Use import.meta.env for Vite or fallback to localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL     + '/api' || 'http://localhost:5000/api',
  withCredentials: true
});

// Request interceptor to add auth token to headers
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Only handle 401 errors and avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Use the same axios instance for token refresh
        const response = await api.post('/auth/refresh-token');
        
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        
        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;