// backend/controllers/dashboardController.js
import Referral from '../models/Referral.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalReferrals = await Referral.countDocuments({ referrer: userId });
    const completedReferrals = await Referral.countDocuments({ 
      referrer: userId,
      status: 'completed'
    });
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const conversionRate = totalReferrals > 0 
      ? Math.round((completedReferrals / totalReferrals) * 100)
      : 0;
      
    res.status(200).json({
      success: true,
      data: {
        totalReferrals,
        pointsEarned: user.points,
        rewardsClaimed: user.rewards.length,
        conversionRate
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getRecentReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user.id })
      .sort('-createdAt')
      .limit(5);
      
    res.status(200).json({
      success: true,
      data: referrals
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};