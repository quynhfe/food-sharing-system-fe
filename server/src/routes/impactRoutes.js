import express from 'express';
import { getImpactStats, getGlobalImpact, getImpactChart } from '../controllers/impactController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/global', getGlobalImpact);
router.get('/user/:id', getImpactStats);
router.get('/stats', protect, getImpactStats); // Keep backward compatibility
router.get('/chart', protect, getImpactChart);

export default router;
