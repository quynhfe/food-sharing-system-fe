import express from 'express';
import { createRequest, getRequestStatus, cancelRequest, acceptRequest, rejectRequest, getPostRequests } from '../controllers/requestController.js';
import { protect } from '../helpers/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all request routes
router.use(protect);

router.post('/', createRequest);
router.get('/:id', getRequestStatus);
router.post('/:id/cancel', cancelRequest);
router.post('/:id/accept', acceptRequest);
router.post('/:id/reject', rejectRequest);
router.get('/post/:postId', getPostRequests);

export default router;
