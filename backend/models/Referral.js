// backend/models/Referral.js
import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  refereeEmail: {
    type: String,
    required: true
  },
  refereeName: {
    type: String
  },
  refereeIP: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  },
  pointsAwarded: {
    type: Number,
    default: 0
  },
  rewardClaimed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

referralSchema.index({ referrer: 1, refereeEmail: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

const Referral = mongoose.model('Referral', referralSchema);

export default Referral;