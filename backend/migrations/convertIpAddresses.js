// backend/migrations/convertIpAddresses.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateIPs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    let count = 0;

    for (const user of users) {
      if (user.ipAddresses.length > 0 && typeof user.ipAddresses[0] === 'string') {
        // Convert string IPs to objects
        user.ipAddresses = user.ipAddresses.map(ip => ({
          ip,
          timestamp: new Date(),
          userAgent: 'Migration'
        }));
        
        await user.save();
        count++;
      }
    }

    console.log(`Migrated ${count} users`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrateIPs();