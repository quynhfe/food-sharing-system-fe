import express from 'express';
import { createRating } from '../controllers/ratingController.js';
import { protect } from '../helpers/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRating);

export default router;
