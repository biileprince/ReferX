import mongoose from 'mongoose';

const RewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  pointsRequired: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('Reward', RewardSchema);