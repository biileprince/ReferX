// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// backend/middleware/auth.js
export const protect = async (req, res, next) => {
  let token;
  
  // 1. Check authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Check cookies
  else if (req.cookies?.refreshToken) {
    token = req.cookies.refreshToken;
  }
  // 3. Check localStorage token (for SSR)
  else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database and attach to request
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, user not found' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Session expired, please login again' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed' 
    });
  }
};
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Not authorized as admin' 
    });
  }
};