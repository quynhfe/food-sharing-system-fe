import express from 'express';
import { getUsers, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserProfile);

export default router;
