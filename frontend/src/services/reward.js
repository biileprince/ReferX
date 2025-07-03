// src/services/reward.js
import api from './api';

export const getAvailableRewards = async () => {
  try {
    const response = await api.get('/rewards');
    return response.data.data; // Return data directly
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch rewards');
  }
};

export const claimReward = async (rewardId) => {
  try {
    const response = await api.post('/rewards/claim', { rewardId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to claim reward');
  }
};

export const getUserRewards = async () => {
  try {
    const response = await api.get('/rewards/user');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user rewards');
  }
};