import express from 'express';
<<<<<<< HEAD
import { getPosts, createPost, getPostById, getMyPosts, updatePost } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', protect, createPost);
router.get('/me', protect, getMyPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
=======
import {
  getPosts,
  createPost,
  getPostDetails,
  getPostsForMap,
  getMyPosts,
  updatePost,
  deletePost
} from '../controllers/postController.js';
import { protect } from '../helpers/authMiddleware.js';
import { upload } from '../services/uploadService.js';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, upload.array('images', 5), createPost);

router.route('/map').get(getPostsForMap);
router.route('/me').get(protect, getMyPosts);

router.route('/:id')
  .get(getPostDetails)
  .put(protect, updatePost)
  .delete(protect, deletePost);
>>>>>>> origin/feat/wishlist-search-map-post

export default router;
