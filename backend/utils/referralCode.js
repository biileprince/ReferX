// backend/utils/referralCode.js
import crypto from 'crypto';

export const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};