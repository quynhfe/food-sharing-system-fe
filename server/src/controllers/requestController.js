import Request from '../models/Request.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';
import FoodPost from '../models/FoodPost.js';
import Transaction from '../models/Transaction.js';

/**
 * Helper to update trust score
 */
const updateTrustScore = async (
  userId,
  points,
  isCompletion = false,
  isCancellation = false,
  isNoShow = false
) => {
  const user = await User.findById(userId);
  if (!user) return;

  // Calculate new score (cap at 100, min 0)
  let newScore = (user.trustScore.score || 50) + points;
  if (newScore > 100) newScore = 100;
  if (newScore < 0) newScore = 0;

  user.trustScore.score = newScore;
  
  if (isCompletion) {
    user.trustScore.totalCompleted = (user.trustScore.totalCompleted || 0) + 1;
  }

  if (isCancellation) {
    user.trustScore.totalCancelled = (user.trustScore.totalCancelled || 0) + 1;
  }

  if (isNoShow) {
    user.trustScore.noShowCount = (user.trustScore.noShowCount || 0) + 1;
    // Treat no-show similarly to cancellation for completion rate
    user.trustScore.totalCancelled = (user.trustScore.totalCancelled || 0) + 1;
  }
  
  // Recalculate completion rate (totalCompleted / (totalCompleted + totalCancelled)
  const completed = user.trustScore.totalCompleted || 0;
  const cancelled = user.trustScore.totalCancelled || 0;
  const total = completed + cancelled;
  
  if (total > 0) {
    user.trustScore.completionRate = Math.round((completed / total) * 100);
  }

  await user.save();
};

/**
 * @desc  Create a new food request
 * @route POST /api/v1/requests
 * @access Private
 */
export const createRequest = async (req, res, next) => {
  try {
    const { postId, message, requestedQty, requestedQuantity } = req.body;
    const receiverId = req.user._id;
    const requested = requestedQty ?? requestedQuantity;

    const post = await FoodPost.findById(postId);
    if (!post) return sendError(res, 'Không tìm thấy bài đăng', 404);

    if (post.donorId.toString() === receiverId.toString()) {
      return sendError(res, 'Bạn không thể yêu cầu thực phẩm của chính mình', 400);
    }

    if (typeof requested !== 'number' || Number.isNaN(requested) || requested <= 0) {
      return sendError(res, 'Số lượng yêu cầu không hợp lệ', 400);
    }

    if (post.availableQuantity < requested) {
      return sendError(res, 'Số lượng yêu cầu vượt quá số lượng hiện có', 400);
    }

    const existingRequest = await Request.findOne({
      postId,
      receiverId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return sendError(res, 'Bạn đã có yêu cầu cho bài đăng này', 400);
    }

    const newRequest = new Request({
      postId,
      donorId: post.donorId,
      receiverId,
      message,
      requestedQty: requested,
    });

    await newRequest.save();
    return sendSuccess(res, newRequest, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Accept a request
 * @route POST /api/v1/requests/:id/accept
 * @access Private
 */
export const acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const donorId = req.user._id;

    const request = await Request.findById(id).populate('postId');
    if (!request) return sendError(res, 'Không tìm thấy yêu cầu', 404);

    if (request.donorId.toString() !== donorId.toString()) {
      return sendError(res, 'Bạn không có quyền thực hiện thao tác này', 403);
    }

    if (request.status !== 'pending') {
      return sendError(res, 'Chỉ có thể chấp nhận yêu cầu đang chờ', 400);
    }

    // Deduct quantity from post
    const post = request.postId;
    if (post.availableQuantity < request.requestedQty) {
      return sendError(res, 'Số lượng trên bài đăng không đủ', 400);
    }

    post.availableQuantity -= request.requestedQty;
    if (post.availableQuantity === 0) {
      post.status = 'completed'; // fully claimed — no more requests
    }
    await post.save();

    request.status = 'accepted';
    await request.save();

    // Create a Transaction and Conversation when accepted
    const transaction = new Transaction({
      requestId: request._id,
      postId: post._id,
      donorId: donorId,
      receiverId: request.receiverId,
      quantity: request.requestedQty,
      unit: post.unit,
      status: 'active'
    });
    await transaction.save();

    const conversation = new Conversation({
      transactionId: transaction._id,
      donorId,
      receiverId: request.receiverId
    });
    await conversation.save();

    return sendSuccess(res, { 
      message: 'Đã chấp nhận yêu cầu', 
      request,
      conversationId: conversation._id 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Reject a request
 * @route POST /api/v1/requests/:id/reject
 * @access Private
 */
export const rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);

    if (!request) return sendError(res, 'Không tìm thấy yêu cầu', 404);
    if (request.donorId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Không có quyền từ chối', 403);
    }
    if (request.status !== 'pending') {
      return sendError(res, 'Chỉ có thể từ chối yêu cầu đang pending', 400);
    }

    request.status = 'rejected';
    await request.save();

    return sendSuccess(res, { message: 'Đã từ chối yêu cầu', request });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Cancel a request
 * @route POST /api/v1/requests/:id/cancel
 * @access Private
 */
export const cancelRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id.toString();

    const request = await Request.findById(id).populate('postId');
    if (!request) return sendError(res, 'Không tìm thấy yêu cầu', 404);

    if (request.donorId.toString() !== userId && request.receiverId.toString() !== userId) {
      return sendError(res, 'Không có quyền huỷ', 403);
    }

    if (request.status === 'completed' || request.status === 'cancelled') {
      return sendError(res, 'Không thể huỷ yêu cầu này', 400);
    }

    const previousStatus = request.status;
    request.status = 'cancelled';
    request.cancelReason = reason;
    await request.save();

    // If it was already accepted, restore quantity and penalize the canceling party
    // And mark transaction + conversation cancelled
    if (previousStatus === 'accepted') {
      const post = request.postId;
      post.availableQuantity += request.requestedQty;
      if (post.status === 'reserved') {
        post.status = 'active';
      }
      await post.save();

      const transaction = await Transaction.findOne({ requestId: id });
      if (transaction) {
        await Conversation.findOneAndUpdate(
          { transactionId: transaction._id },
          { status: 'closed' }
        );
        // Transaction enum does not include 'cancelled', so delete it to keep state consistent.
        await Transaction.findByIdAndDelete(transaction._id);
      }

      // Decrement Trust Score by -5 for cancellation
      await updateTrustScore(req.user._id, -5, false, true);
    }

    return sendSuccess(res, { message: 'Đã huỷ yêu cầu', request });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Mark a request as completed
 * @route PUT /api/v1/requests/:id/complete
 * @access Private
 */
export const completeRequest = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const request = await Request.findById(id).populate('postId');

    if (!request) {
      return sendError(res, 'Không tìm thấy yêu cầu', 404);
    }

    // Only the donor can mark as completed
    if (request.donorId.toString() !== userId.toString()) {
      return sendError(res, 'Bạn không có quyền thực hiện thao tác này', 403);
    }

    if (request.status === 'completed') {
      return sendError(res, 'Yêu cầu đã được đánh dấu hoàn tất', 400);
    }

    if (!['accepted'].includes(request.status)) {
      return sendError(res, 'Yêu cầu phải ở trạng thái "accepted" trước khi hoàn tất', 400);
    }

    request.status = 'completed';
    await request.save();

    // Reward both Donor and Receiver with +10 Trust Score
    await updateTrustScore(request.donorId, 10, true);
    await updateTrustScore(request.receiverId, 10, true);

    const transaction = await Transaction.findOne({ requestId: request._id });
    if (transaction) {
       transaction.status = 'completed';
       transaction.completedAt = new Date();
       await transaction.save();

       // Close the linked conversation
       await Conversation.findOneAndUpdate(
         { transactionId: transaction._id },
         { status: 'closed' }
       );
    }

    // Create Impact Record
    const post = request.postId;
    if (post) {
      const UNIT_WEIGHT = { kg: 1, portion: 0.5, box: 1.5, item: 0.3 };
      const weightKg = request.requestedQty * (UNIT_WEIGHT[post.unit] || 0.5);
      
      const mealsShared = post.unit === 'portion' ? request.requestedQty : Math.round(weightKg * 3);
      const co2ReducedKg = weightKg * 2.5;

      // Dynamic import to avoid circular dependency if needed, but standard import should work.
      // We will use standard model creation since ImpactController is not strictly needed for this.
      const mongoose = (await import('mongoose')).default;
      const ImpactRecord = mongoose.model('ImpactRecord');
      
      const impact = new ImpactRecord({
        transactionId: transaction ? transaction._id : null,
        donorId: request.donorId,
        receiverId: request.receiverId,
        mealsShared,
        foodSavedKg: weightKg,
        co2ReducedKg
      });
      await impact.save();
    }

    return sendSuccess(res, { message: 'Giao dịch đã được đánh dấu hoàn tất', request });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get request status by request id
 * @route GET /api/v1/requests/:id
 * @access Private
 */
export const getRequestById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const request = await Request.findOne({ _id: id })
      .populate('postId', 'title images unit expirationDate location category')
      .populate('donorId', 'fullName avatar')
      .populate('receiverId', 'fullName avatar');

    if (!request) return sendError(res, 'Không tìm thấy yêu cầu', 404);

    const donorId = request.donorId._id || request.donorId;
    const receiverId = request.receiverId._id || request.receiverId;

    if (
      donorId.toString() !== userId.toString() &&
      receiverId.toString() !== userId.toString()
    ) {
      return sendError(res, 'Không có quyền xem yêu cầu này', 403);
    }

    const transaction = await Transaction.findOne({ requestId: request._id });
    const conversation = transaction
      ? await Conversation.findOne({ transactionId: transaction._id })
      : null;

    return sendSuccess(res, {
      request,
      transaction: transaction
        ? { _id: transaction._id, status: transaction.status, completedAt: transaction.completedAt }
        : null,
      conversation: conversation ? { _id: conversation._id, status: conversation.status, lastMessage: conversation.lastMessage } : null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc View incoming requests for a specific post (donor only)
 * @route GET /api/v1/requests/post/:postId
 * @access Private
 */
export const getIncomingRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    const post = await FoodPost.findById(postId);
    if (!post) return sendError(res, 'Không tìm thấy bài đăng', 404);

    if (post.donorId.toString() !== userId.toString()) {
      return sendError(res, 'Không có quyền xem các yêu cầu của bài đăng này', 403);
    }

    const requests = await Request.find({ postId })
      .populate('receiverId', 'fullName avatar')
      .populate('donorId', 'fullName avatar')
      .sort({ createdAt: -1 });

    return sendSuccess(res, requests);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Report no-show for an accepted request
 * Penalizes the other party by -15 trust score.
 * @route PUT /api/v1/requests/:id/no-show
 * @access Private
 */
export const reportNoShow = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const request = await Request.findById(id).populate('postId');
    if (!request) return sendError(res, 'Không tìm thấy yêu cầu', 404);

    const isDonor = request.donorId.toString() === userId.toString();
    const isReceiver = request.receiverId.toString() === userId.toString();
    if (!isDonor && !isReceiver) return sendError(res, 'Không có quyền thao tác', 403);

    if (request.status !== 'accepted') {
      return sendError(res, 'Chỉ có thể báo cáo no-show khi yêu cầu đã được chấp nhận', 400);
    }

    const transaction = await Transaction.findOne({ requestId: request._id });
    if (!transaction) return sendError(res, 'Không tìm thấy giao dịch liên quan', 404);

    const post = request.postId;
    // Restore quantity since the food was not picked up.
    if (post) {
      post.availableQuantity += request.requestedQty;
      if (post.status === 'reserved') {
        post.status = 'active';
      }
      await post.save();
    }

    // Close conversation
    await Conversation.findOneAndUpdate(
      { transactionId: transaction._id },
      { status: 'closed' }
    );

    // Update request + transaction statuses
    request.status = 'cancelled';
    request.cancelReason = 'no_show';
    request.cancelledBy = userId;
    await request.save();

    transaction.status = 'no_show';
    transaction.noShowReportedBy = userId;
    transaction.noShowAt = new Date();
    await transaction.save();

    // Penalize the other party (the one who no-showed)
    const penalizedUserId = isDonor ? request.receiverId : request.donorId;
    await updateTrustScore(penalizedUserId, -15, false, false, true);

    return sendSuccess(res, { message: 'Đã báo cáo no-show', request });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get requests made by logged-in user (Receiver)
 * @route GET /api/v1/requests/me
 * @access Private
 */
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ receiverId: req.user._id })
      .populate({
        path: 'postId',
        select: 'title images unit status expirationDate location'
      })
      .populate('donorId', 'fullName avatar')
      .sort({ createdAt: -1 });

    return sendSuccess(res, requests);
  } catch (err) {
    next(err);
  }
};
