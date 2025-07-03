// backend/routes/dashboardRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getDashboardStats,
  getRecentReferrals
} from '../controllers/dashboardController.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recent-referrals', getRecentReferrals);

export default router;