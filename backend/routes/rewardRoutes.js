// backend/routes/rewardRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getRewards, 
  claimReward,
  getUserRewards
} from '../controllers/rewardController.js';

const router = express.Router();

// Public routes
router.get('/', getRewards);

// Protected routes
router.post('/claim', protect, claimReward);
router.get('/user', protect, getUserRewards);

export default router;