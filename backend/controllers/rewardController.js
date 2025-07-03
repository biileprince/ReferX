// backend/controllers/rewardController.js
import Reward from '../models/Reward.js';
import User from '../models/User.js';

// Get all active rewards
export const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: rewards
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Claim a reward
export const claimReward = async (req, res) => {
  const { rewardId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const reward = await Reward.findById(rewardId);

    if (!user || !reward) {
      return res.status(404).json({ 
        success: false, 
        message: 'User or reward not found' 
      });
    }

    if (!reward.isActive) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reward is not available' 
      });
    }

    if (user.points < reward.pointsRequired) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not enough points' 
      });
    }

    // Deduct points and assign reward
    user.points -= reward.pointsRequired;
    user.rewards.push({
      reward: reward._id,
      claimedAt: new Date()
    });
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Reward claimed successfully',
      user: {
        points: user.points,
        rewards: user.rewards
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get user's claimed rewards
export const getUserRewards = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('rewards.reward', 'name description pointsRequired');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Format response
    const rewards = user.rewards.map(r => ({
      _id: r._id,
      reward: r.reward,
      claimedAt: r.claimedAt
    }));

    res.status(200).json({
      success: true,
      data: rewards
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};