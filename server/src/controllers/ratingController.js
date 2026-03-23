import Rating from '../models/Rating.js';
import Transaction from '../models/Transaction.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';

/**
 * @desc Submit rating/feedback for a completed transaction
 * @route POST /api/v1/reviews
 * @access Private
 */
export const createRating = async (req, res, next) => {
  try {
    const { transactionId, score, comment = '' } = req.body;

    if (!transactionId || !score) {
      return sendError(res, 'Mã giao dịch và số sao đánh giá là bắt buộc', 400);
    }

    if (score < 1 || score > 5) {
      return sendError(res, 'Số sao đánh giá phải từ 1 đến 5', 400);
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return sendError(res, 'Giao dịch không tồn tại', 404);
    }

    // Usually can only rate when completed, but what if they rate active transactions? 
    // Wait, the prompt requirements explicitly say "sau khi giao dịch COMPLETED"
    if (transaction.status !== 'completed') {
      return sendError(res, 'Chỉ có thể đánh giá sau khi giao dịch hoàn tất', 400);
    }

    // Determine who is rating: Must be either donor or receiver of the transaction
    const isDonor = transaction.donorId.toString() === req.user._id.toString();
    const isReceiver = transaction.receiverId.toString() === req.user._id.toString();

    if (!isDonor && !isReceiver) {
      return sendError(res, 'Bạn không thuộc diện tham gia giao dịch này để đánh giá', 403);
    }

    // Determine the person being rated
    const ratedUserId = isDonor ? transaction.receiverId : transaction.donorId;

    // Check for duplicate rating to avoid multiple ratings on same transaction
    const existingRating = await Rating.findOne({ transactionId, raterId: req.user._id });
    if (existingRating) {
      return sendError(res, 'Bạn đã đánh giá giao dịch này rồi', 400);
    }

    const rating = await Rating.create({
      transactionId,
      raterId: req.user._id,
      ratedUserId,
      score,
      comment
    });

    return sendSuccess(res, rating, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all reviews for a specific user
 * @route GET /api/v1/users/:id/reviews
 * @access Public
 */
export const getUserReviews = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const reviews = await Rating.find({ ratedUserId: userId })
      .populate('raterId', 'fullName avatar')
      .populate({
        path: 'transactionId',
        select: 'postId quantity',
        populate: { path: 'postId', select: 'title' }
      })
      .sort({ createdAt: -1 });

    return sendSuccess(res, reviews, 200);
  } catch (error) {
    next(error);
  }
};
