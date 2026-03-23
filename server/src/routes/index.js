import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import chatRoutes from './chatRoutes.js';
import requestRoutes from './requestRoutes.js';
import postRoutes from './postRoutes.js';
import impactRoutes from './impactRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/chats', chatRoutes);
router.use('/requests', requestRoutes);
router.use('/posts', postRoutes);
router.use('/impact', impactRoutes);

export default router;
