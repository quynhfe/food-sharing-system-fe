import express from 'express';
import { getUserTransactions } from '../controllers/requestController.js';
import { getUserReviews } from '../controllers/ratingController.js';
import { protect } from '../helpers/authMiddleware.js';

const router = express.Router();

router.get('/me/transactions', protect, getUserTransactions);
router.get('/:id/reviews', getUserReviews);

export default router;
