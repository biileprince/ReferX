// backend/routes/referralRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  checkDuplicateReferral, 
  preventSelfReferral,
  detectDeviceSharing
} from '../middleware/fraudDetection.js';
import {
  submitReferral,
  getUserReferrals,
  getLeaderboard
} from '../controllers/referralController.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  preventSelfReferral,
  checkDuplicateReferral,
   detectDeviceSharing,
  checkDuplicateReferral,
  submitReferral
);
router.get('/', getUserReferrals);
router.get('/leaderboard', getLeaderboard);

export default router;