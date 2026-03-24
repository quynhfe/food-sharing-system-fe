import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';

/**
 * @desc Get user's notifications (paginated)
 * @route GET /api/v1/notifications
 * @access Private
 */
export const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('relatedPostId', 'title')
      .lean();

    const total = await Notification.countDocuments({ userId: req.user._id });
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

    return sendSuccess(res, {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Mark a notification as read
 * @route PUT /api/v1/notifications/:id/read
 * @access Private
 */
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return sendError(res, 'Notification not found', 404);
    }

    return sendSuccess(res, notification);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Mark all notifications as read
 * @route PUT /api/v1/notifications/read-all
 * @access Private
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return sendSuccess(res, { modifiedCount: result.modifiedCount });
  } catch (err) {
    next(err);
  }
};
