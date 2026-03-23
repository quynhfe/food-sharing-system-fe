import express from 'express';
import { getPosts, createPost, getPostById, getMyPosts, updatePost } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', protect, createPost);
router.get('/me', protect, getMyPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);

export default router;
