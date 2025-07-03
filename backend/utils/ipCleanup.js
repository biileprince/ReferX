// backend/utils/ipCleanup.js
import User from '../models/User.js';
import cron from 'node-cron';

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    await User.updateMany(
      {},
      { 
        $pull: { 
          ipAddresses: { 
            timestamp: { $lt: sixMonthsAgo } 
          } 
        } 
      }
    );
    
    console.log('IP cleanup completed successfully');
  } catch (err) {
    console.error('IP cleanup failed:', err);
  }
});