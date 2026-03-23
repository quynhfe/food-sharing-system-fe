import express from 'express';
import { getChats, getChatMessages } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getChats);
router.get('/:id/messages', protect, getChatMessages);

export default router;
