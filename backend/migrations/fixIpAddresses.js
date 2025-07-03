// backend/migrations/fixIpAddresses.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const fixIpAddresses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    let fixedCount = 0;

    for (const user of users) {
      if (user.ipAddresses && user.ipAddresses.length > 0 && typeof user.ipAddresses[0] === 'string') {
        // Convert string IPs to objects
        user.ipAddresses = user.ipAddresses.map(ip => ({
          ip,
          timestamp: new Date(),
          userAgent: 'Migrated'
        }));
        
        await user.save();
        fixedCount++;
        console.log(`Fixed user: ${user.email}`);
      }
    }

    console.log(`Fixed ${fixedCount} users`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

fixIpAddresses();