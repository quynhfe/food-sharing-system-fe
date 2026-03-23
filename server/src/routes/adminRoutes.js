import express from 'express';
import { protect, requireAdmin } from '../middlewares/authMiddleware.js';
import { getAdminDashboard, suspendPost, suspendUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard', protect, requireAdmin, getAdminDashboard);
router.put('/posts/:id/suspend', protect, requireAdmin, suspendPost);
router.put('/users/:id/suspend', protect, requireAdmin, suspendUser);

export default router;
