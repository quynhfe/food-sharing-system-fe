import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import requestRoutes from './requestRoutes.js';
import ratingRoutes from './ratingRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/requests', requestRoutes);
router.use('/reviews', ratingRoutes);

export default router;
