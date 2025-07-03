// backend/models/User.js
import mongoose from 'mongoose';
import { generateReferralCode } from '../utils/referralCode.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  referralCode: {
    type: String,
    unique: true,
    default: generateReferralCode
  },
  ipAddresses: [{
    ip: String,
    timestamp: Date,
    userAgent: String
  }],
    rewards: [{
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward'
    },
    claimedAt: {
      type: Date,
      default: Date.now
    }
  }]
,

  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  refreshToken: String,
  // ipAddresses: [String],
   resetPasswordToken: String,
  resetPasswordExpire: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  
}, {
  timestamps: true
});

// Pre-save hook to ensure unique referral code
userSchema.pre('save', async function(next) {
  // Only generate referral code for new users
  if (this.isNew) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!isUnique && attempts < maxAttempts) {
      try {
        // Generate new code if not set or if duplicate
        if (!this.referralCode) {
          this.referralCode = generateReferralCode();
        }
        
        // Check for existing code
        const existing = await this.constructor.findOne({ 
          referralCode: this.referralCode,
          _id: { $ne: this._id }
        });
        
        if (!existing) {
          isUnique = true;
        } else {
          this.referralCode = generateReferralCode();
        }
      } catch (err) {
        return next(err);
      }
      attempts++;
    }
    
    if (!isUnique) {
      return next(new Error('Failed to generate unique referral code'));
    }
  }
  
  next();
});

const User = mongoose.model('User', userSchema);

export default User;