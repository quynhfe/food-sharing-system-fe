import express from 'express';
import { getChats, getChatMessages, getConversationByPost } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getChats);
router.get('/by-post/:postId', protect, getConversationByPost);
router.get('/:id/messages', protect, getChatMessages);

export default router;
