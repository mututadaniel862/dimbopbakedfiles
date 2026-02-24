import cron from 'node-cron';
import { checkAndSuspendExpiredSubscriptions } from '../services/subscriptionService';

// Run every day at midnight
export const startSubscriptionCron = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('🕒 Running subscription expiry check...');
    await checkAndSuspendExpiredSubscriptions();
  });
  
  console.log('✅ Subscription cron job started');
};