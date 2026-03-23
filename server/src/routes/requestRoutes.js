import express from 'express';
import { completeRequest } from '../controllers/requestController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/:id/complete', protect, completeRequest);

export default router;
