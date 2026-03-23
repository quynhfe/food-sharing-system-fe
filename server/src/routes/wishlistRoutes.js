import express from 'express';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../helpers/authMiddleware.js';

const router = express.Router();

router.use(protect); // All wishlist routes require auth

router.route('/').get(getWishlist).post(addToWishlist);
router.route('/check/:postId').get(checkWishlist);
router.route('/:id').delete(removeFromWishlist);

export default router;
