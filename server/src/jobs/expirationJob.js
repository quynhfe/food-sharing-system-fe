import cron from 'node-cron';
import FoodPost from '../models/FoodPost.js';
import Notification from '../models/Notification.js';

export const startExpirationJob = () => {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      // Find active posts that have expired
      const expiredPosts = await FoodPost.find({
        status: 'active',
        expirationDate: { $lt: new Date() },
      });

      if (expiredPosts.length === 0) return;

      const postIds = expiredPosts.map((post) => post._id);
      
      // Update status to expired
      await FoodPost.updateMany(
        { _id: { $in: postIds } },
        { $set: { status: 'expired' } }
      );

      // Create notifications for donors
      const notifications = expiredPosts.map((post) => ({
        userId: post.donorId,
        type: 'POST_EXPIRED',
        title: 'Tin đăng đã hết hạn',
        message: `Tin đăng "${post.title}" của bạn đã hết hạn bảo quản và được tự động chuyển sang trạng thái Hết hạn.`,
        relatedPostId: post._id,
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }

      console.log(`[ExpirationJob] Expired ${expiredPosts.length} posts.`);
    } catch (error) {
      console.error('[ExpirationJob] Error running expiration job:', error);
    }
  });

  console.log('[ExpirationJob] Job scheduled to run every 15 minutes.');
};
