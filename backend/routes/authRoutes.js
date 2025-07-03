import express from 'express';
import {
  register,
  verifyEmail,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleAuthCallback,
   logout,
   updateProfile ,
    getMe 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.put('/profile', protect, updateProfile);
router.get('/me', protect, getMe);

export default router;