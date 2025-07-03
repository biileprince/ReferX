import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import rateLimit from './config/rateLimit.js';
import authRoutes from './routes/authRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import passport from 'passport';
import configurePassport from './config/passport.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import './utils/ipCleanup.js';


dotenv.config();

const app = express();

configurePassport();
app.use(passport.initialize())

// Security middleware
app.use(helmet(
  {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }
));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(rateLimit);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());


// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/dashboard', dashboardRoutes);


// Test endpoint only in development
if (process.env.NODE_ENV !== 'production') {
  app.get('/test-email', async (req, res) => {
    try {
      const testUser = { 
        email: process.env.TEST_EMAIL || 'test@example.com', 
        name: 'Test User' 
      };
      
      const testUrl = 'https://example.com/verify';
      
      await new EmailSender(testUser, testUrl).sendVerification();
      
      res.send('Test email sent successfully');
    } catch (error) {
      console.error('Email Test Error:', error);
      res.status(500).send(`Email test failed: ${error.message}`);
    }
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));