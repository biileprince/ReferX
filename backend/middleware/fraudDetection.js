// backend/middleware/fraudDetection.js
import Referral from '../models/Referral.js';
import User from '../models/User.js';

// Enhanced fraud detection with IP tracking
export const checkDuplicateReferral = async (req, res, next) => {
  const { email } = req.body;
  const referrer = req.user.id;
  const ipAddress = req.ip;

  try {
    // 1. Check if same referrer + same email
    const existingByEmail = await Referral.findOne({ referrer, refereeEmail: email });
    if (existingByEmail) {
      return res.status(400).json({
        success: false,
        message: 'Referral with this email already exists'
      });
    }

    // 2. Check IP-based duplicates within 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingByIP = await Referral.findOne({
      referrer,
      refereeIP: ipAddress,
      createdAt: { $gte: twentyFourHoursAgo }
    });

    if (existingByIP) {
      return res.status(400).json({
        success: false,
        message: 'Too many referrals from this IP address'
      });
    }

    // 3. Check if email belongs to existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }

    // 4. Check if referrer has used this IP before
    const referrerUser = await User.findById(referrer);
    const referrerIPs = referrerUser.ipAddresses.map(ipObj => ipObj.ip);
    
    if (referrerIPs.includes(ipAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Self-referral from same device is not allowed'
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Fraud detection error' 
    });
  }
};

export const preventSelfReferral = (req, res, next) => {
  if (req.user.email === req.body.email) {
    return res.status(400).json({
      success: false,
      message: 'You cannot refer yourself'
    });
  }
  next();
};

// New middleware to detect device sharing
export const detectDeviceSharing = async (req, res, next) => {
  const { email } = req.body;
  const ipAddress = req.ip;

  try {
    // Check if this IP has registered multiple accounts
    const usersWithSameIP = await User.find({
      'ipAddresses.ip': ipAddress
    });

    if (usersWithSameIP.length > 2) {
      return res.status(400).json({
        success: false,
        message: 'Too many accounts created from this device'
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Device sharing detection error' 
    });
  }
};