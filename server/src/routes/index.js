import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import postRoutes from './postRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/notifications', notificationRoutes);

export default router;
