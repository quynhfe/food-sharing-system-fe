import User from '../models/User.js';
import FoodPost from '../models/FoodPost.js';
import Transaction from '../models/Transaction.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';

/**
 * @desc Dashboard overview for admin
 * @route GET /api/v1/admin/dashboard
 * @access Private (Admin)
 */
export const getAdminDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalFoodPosts, totalCompletedTransactions] = await Promise.all([
      User.countDocuments({}),
      FoodPost.countDocuments({ status: { $ne: 'deleted' } }),
      Transaction.countDocuments({ status: 'completed' }),
    ]);

    return sendSuccess(res, {
      totalUsers,
      totalFoodPosts,
      totalCompletedTransactions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Hide/suspend a food post
 * @route PUT /api/v1/admin/posts/:id/suspend
 * @access Private (Admin)
 */
export const suspendPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const post = await FoodPost.findById(id);
    if (!post) return sendError(res, 'Không tìm thấy bài đăng', 404);
    if (post.status === 'deleted') return sendError(res, 'Không thể thao tác với bài đăng đã xoá', 400);

    post.status = 'hidden';
    post.hiddenBy = adminId;
    post.hiddenAt = new Date();

    await post.save();
    return sendSuccess(res, { post });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Suspend a user account
 * @route PUT /api/v1/admin/users/:id/suspend
 * @access Private (Admin)
 */
export const suspendUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const user = await User.findById(id);
    if (!user) return sendError(res, 'Không tìm thấy người dùng', 404);

    if (user.role === 'admin') return sendError(res, 'Không thể suspend tài khoản admin', 400);

    user.status = 'suspended';
    user.suspendedBy = adminId;
    user.suspendedAt = new Date();

    await user.save();
    return sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
};
