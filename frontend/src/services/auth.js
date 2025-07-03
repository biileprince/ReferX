import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed. Please try again later.';
    throw new Error(message);
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Email verification failed'
    );
  }
};


export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    // FIX: Return consistent error format
    const message = error.response?.data?.message || 
                   (error.response?.status === 401 
                    ? 'Invalid email or password' 
                    : 'Login failed');
    throw new Error(message);
  }
};
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Logout failed'
    );
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Password reset failed'
    );
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      password: newPassword
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Password reset failed';
    throw new Error(message);
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Password change failed'
    );
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    if (response.data && response.data.success && response.data.user) {
      return response.data.user;
    }
    throw new Error('Failed to fetch user data');
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch user data'
    );
  }
};

// export const refreshToken = async () => {
//   try {
//     const response = await api.post('/auth/refresh-token');
//     return response.data.token;
//   } catch (error) {
   
//     if (error.response?.status === 401) {
//       throw new Error('Session expired. Please login again');
//     }
//     throw new Error(
//       error.response?.data?.message || 
//       'Token refresh failed'
//     );
//   }
// };
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Profile update failed'
    );
  }
};
export const isAuthError = (error) => {
  return error.response?.status === 401;
};

