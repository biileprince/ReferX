import axios from 'axios';

// Create Axios instance with proper credentials handling
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Crucial for cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor
api.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;
  
  // Handle 401 errors
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    
    try {
      // Refresh token
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
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
});

export default api;