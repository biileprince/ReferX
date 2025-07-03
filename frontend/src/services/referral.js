// src/services/referral.js
import api from './api';

export const submitReferral = async (data) => {
  try {
    const response = await api.post('/referrals', data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to submit referral'
    );
  }
};

export const getUserReferrals = async () => {
  try {
    const response = await api.get('/referrals');

    return response.data.data || []; 
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch referrals'
    );
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await api.get('/referrals/leaderboard');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch leaderboard'
    );
  }
};