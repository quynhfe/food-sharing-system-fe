import express from 'express';
import { 
  createRequest, 
  acceptRequest, 
  rejectRequest, 
  cancelRequest, 
  completeRequest,
  getIncomingRequests,
  getRequestById,
  reportNoShow,
  getMyRequests,
  getDonorRequestHistory,
} from '../controllers/requestController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRequest);
router.post('/:id/accept', protect, acceptRequest);
router.post('/:id/reject', protect, rejectRequest);
router.post('/:id/cancel', protect, cancelRequest);
router.put('/:id/complete', protect, completeRequest);

// Order matters: static paths before /:id
router.get('/donor/history', protect, getDonorRequestHistory);
router.get('/post/:postId', protect, getIncomingRequests);
router.get('/me', protect, getMyRequests);
router.get('/:id', protect, getRequestById);
router.put('/:id/no-show', protect, reportNoShow);

export default router;
