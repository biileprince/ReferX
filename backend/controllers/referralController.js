import Referral from '../models/Referral.js';
import User from '../models/User.js';

// Submit referral
export const submitReferral = async (req, res) => {
  const { name, email } = req.body;
  const referrer = req.user.id;
  const ipAddress = req.ip;

  try {
    const referral = await Referral.create({
      referrer,
      refereeName: name,
      refereeEmail: email,
      refereeIP: ipAddress
    });

    res.status(201).json({
      success: true,
      message: 'Referral submitted',
      data: referral
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get user referrals
export const getUserReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user.id })
      .sort('-createdAt');

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

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      { $match: { points: { $gt: 0 } }},
      { $sort: { points: -1 } },
      { $limit: 5 },
      { $project: { 
          _id: 0, 
          name: 1, 
          points: 1,
          referralCode: 1 
        } 
      }
    ]);

    res.status(200).json({ 
      success: true, 
      data: leaderboard 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};