import express from 'express';
import { getImpactStats, getImpactChart } from '../controllers/impactController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getImpactStats);
router.get('/chart', protect, getImpactChart);

export default router;
