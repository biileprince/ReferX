// src/services/dashboard.js
import api from './api';

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data.data; // Return data directly
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch dashboard stats'
    );
  }
};

export const getRecentReferrals = async () => {
  try {
    const response = await api.get('/dashboard/recent-referrals');
    return response.data.data; // Return data directly
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch recent referrals'
    );
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await api.get('/referrals/leaderboard');
    return response.data.data; // Return data directly
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch leaderboard'
    );
  }
};