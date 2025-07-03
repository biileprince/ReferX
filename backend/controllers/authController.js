import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import EmailSender from '../utils/emailSender.js';
import { generateToken, generateRefreshToken } from '../utils/tokenGenerator.js';

import { generateReferralCode } from './../utils/referralCode.js';
import Referral from './../models/Referral.js';
import mongoose from 'mongoose';

const sendVerificationEmail = async (user, token) => {
  try {
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await new EmailSender(user, url).sendVerification();
  } catch (error) {
    console.error('Email sending error:', error.message);
  }
};

export const register = async (req, res) => {
  const { name, email, password, confirmPassword, ref: referralCode } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];
  let user = null;
  let session = null;

  try {
    // Validate inputs
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with a letter, number, and special character'
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Handle referral BEFORE creating user
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      
      if (referrer) {
        // Fraud check: Same device detection
        const referrerIPs = referrer.ipAddresses.map(ipObj => ipObj.ip);
        
        if (referrerIPs.includes(ipAddress)) {
          return res.status(400).json({
            success: false,
            message: 'Self-referral from same device is not allowed'
          });
        }

        // Check if IP has too many registrations
        const registrationsFromIP = await User.countDocuments({
          'ipAddresses.ip': ipAddress,
          createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });
        
        if (registrationsFromIP >= 3) {
          return res.status(400).json({
            success: false,
            message: 'Too many registrations from this device'
          });
        }
      }
    }

    // Start transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      referralCode: generateReferralCode(),
      ipAddresses: [{ 
        ip: ipAddress, 
        timestamp: new Date(),
        userAgent 
      }]
    });

    // Generate verification token
    const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_VERIFY_SECRET, {
      expiresIn: '1h'
    });
    
    user.verificationToken = verificationToken;
    
    // Save user in transaction
    await user.save({ session });

    // Handle referral if valid
    if (referrer) {
      const referral = new Referral({
        referrer: referrer._id,
        referee: user._id,
        refereeEmail: email,
        refereeIP: ipAddress,
        status: 'pending', // Set to pending until email verification
        pointsAwarded: 30
      });
      
      await referral.save({ session });
      
      // Update referrer's points
      referrer.points += 30;
      await referrer.save({ session });
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send verification email (outside transaction)
    await sendVerificationEmail(user, verificationToken);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for verification'
    });

  } catch (err) {
    console.error('Registration error:', err);
    
    // Abort transaction if it exists
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    
    // Cleanup: Delete user if created but registration failed
    if (user && user._id) {
      try {
        await User.deleteOne({ _id: user._id });
        console.log(`Rollback: Deleted user ${email} due to registration failure`);
        
        // Delete any orphaned referrals
        if (referralCode) {
          await Referral.deleteOne({ refereeEmail: email });
        }
      } catch (cleanupErr) {
        console.error('Cleanup failed during registration rollback:', cleanupErr);
      }
    }
    
    // Handle specific errors
    let errorMessage = 'Registration failed. Please try again later.';
    
    if (err.code === 11000) {
      if (err.keyPattern?.referralCode) {
        errorMessage = 'Referral code already exists';
      } else if (err.keyPattern?.email) {
        errorMessage = 'Email already registered';
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage 
    });
  }
};

// Email verification

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  let session = null;

  try {
    // Verify token without session first
    const decoded = jwt.verify(token, process.env.JWT_VERIFY_SECRET);
    
    // Start transaction session
    session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findById(decoded.id).session(session);
    
    if (!user) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification token' 
      });
    }

    // If already verified, just return success
    if (user.isVerified) {
      await session.commitTransaction();
      return res.status(200).json({ 
        success: true, 
        message: 'Email was already verified' 
      });
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save({ session });

    // Complete pending referrals
    const referrals = await Referral.find({
      refereeEmail: user.email,
      status: 'pending'
    }).session(session);

    // Process each pending referral
    for (const referral of referrals) {
      referral.status = 'completed';
      referral.referee = user._id;
      await referral.save({ session });
      
      // Update referrer's points
      await User.findByIdAndUpdate(
        referral.referrer,
        { $inc: { points: referral.pointsAwarded } },
        { session }
      );
      
      // Send notification to referrer
      await new EmailSender(
        await User.findById(referral.referrer).session(session),
        `${process.env.CLIENT_URL}/referrals`
      ).sendReferralSuccess(user.name);
    }

    // Commit transaction
    await session.commitTransaction();
    
    res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully! You can now log in.' 
    });
  } catch (err) {
    // Handle token expiration specifically
    if (err.name === 'TokenExpiredError') {
      try {
        const decoded = jwt.decode(token);
        const user = await User.findById(decoded.id);
        
        if (user && !user.isVerified) {
          // Generate new token
          const newToken = jwt.sign({ id: user._id }, process.env.JWT_VERIFY_SECRET, {
            expiresIn: '1h'
          });
          
          // Update user and send new email
          user.verificationToken = newToken;
          await user.save();
          await sendVerificationEmail(user, newToken);
          
          return res.status(400).json({ 
            success: false,
            message: 'Token expired. A new verification email has been sent.'
          });
        }
      } catch (innerErr) {
        console.error('Token refresh error:', innerErr);
      }
    }
    
    // Abort transaction if it exists
    if (session) {
      await session.abortTransaction();
    }
    
    console.error('Verification error:', err);
    
    res.status(400).json({ 
      success: false, 
      message: 'Invalid or expired verification token' 
    });
  } finally {
    // End session if it exists
    if (session) {
      session.endSession();
    }
  }
};

// User login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password +refreshToken');

    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check email verification status
    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email first' 
      });
    }

    // Track new IP addresses
    const ipAddress = req.ip;
    const ipExists = user.ipAddresses.some(ipObj => ipObj.ip === ipAddress);
    
    if (!ipExists) {
      user.ipAddresses.push({ 
        ip: ipAddress, 
        timestamp: Date.now(),
        userAgent: req.headers['user-agent'] 
      });
      await user.save();
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none', // Required for cross-site requests
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : 'localhost'
    });

    // Send response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        referralCode: user.referralCode
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    
    // Security: Delay response on failure
    setTimeout(() => {
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }, 1000);
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ 
      success: false, 
      message: 'No refresh token provided' 
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid refresh token' 
      });
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    
    user.refreshToken = newRefreshToken;
    await user.save();
    
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : 'localhost'
    });
    
    res.status(200).json({ 
      success: true, 
      token: newToken,
    });
  } catch (err) {
    // Handle token expiration specifically
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired. Please log in again.'
      });
    }
    
    console.error('Refresh token error:', err);
    res.status(403).json({ 
      success: false, 
      message: 'Invalid refresh token' 
    });
  }
};
//forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Email not found' 
      });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, {
      expiresIn: '10m'
    });

    // URL-encode the token to make it safe for URLs
    const encodedToken = encodeURIComponent(resetToken);
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 600000;
    await user.save();

    // Use the encoded token in the URL
    await new EmailSender(user, `${process.env.CLIENT_URL}/reset-password/${encodedToken}`)
      .sendPasswordReset();

    res.status(200).json({ 
      success: true, 
      message: 'Password reset email sent' 
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
// Reset password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.resetPasswordToken !== token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid token for this user' 
      });
    }

    if (user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token has expired' 
      });
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with a letter, number, and special character'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Password reset successful' 
    });
  } catch (err) {
    console.error('Password reset error:', err);
    
    // More specific error messages
    let message = 'Invalid or expired token';
    if (err.name === 'TokenExpiredError') {
      message = 'Token has expired';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token format';
    }
    
    res.status(400).json({ 
      success: false, 
      message
    });
  }
};
// Google OAuth
export const googleAuth = (req, res) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })(req, res);
};

export const googleAuthCallback = (req, res) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=google-auth-failed`);
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  })(req, res);
};




// User logout
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // If token exists, find user and invalidate it
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user) {
          // Invalidate token by clearing server-side reference
          user.refreshToken = undefined;
          await user.save();
        }
      } catch (err) {
        console.log('Token verification failed on logout', err);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({
      success: false,
      message: 'Logout failed. Please try again.'
    });
  }
};

export const updateProfile = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      user 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getMe = async (req, res) => {
  try {
   
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        referralCode: user.referralCode,
        isVerified: user.isVerified,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
