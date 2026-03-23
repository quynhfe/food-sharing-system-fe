import User from '../models/User.js';
import FoodPost from '../models/FoodPost.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';

/**
 * @desc Get all users (Safe version)
 * @route GET /api/v1/users
 * @access Private/Admin
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash');
    return sendSuccess(res, users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get a single user's public profile
 * @route GET /api/v1/users/:id
 * @access Public
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('fullName email avatar trustScore exp role createdAt');

    if (!user) {
      return sendError(res, 'Không tìm thấy người dùng', 404);
    }

    // Also fetch their active posts
    const activePosts = await FoodPost.find({ 
      donorId: req.params.id, 
      status: 'active',
      expirationDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    return sendSuccess(res, {
      user,
      activePosts
    });
  } catch (error) {
    next(error);
  }
};
