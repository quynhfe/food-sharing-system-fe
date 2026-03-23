import Request from '../models/Request.js';
import FoodPost from '../models/FoodPost.js';
import Transaction from '../models/Transaction.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';
import { createRequestSchema, cancelRequestSchema } from '../validators/requestValidator.js';

/**
 * @desc Create a new request for food
 * @route POST /api/v1/requests
 * @access Private
 */
export const createRequest = async (req, res, next) => {
  try {
    const { error } = createRequestSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { postId, requestedQty = 1, message = '' } = req.body;

    const postExists = await FoodPost.findById(postId);
    if (!postExists) {
      return sendError(res, 'Bài đăng không tồn tại', 404);
    }

    if (postExists.status !== 'active') {
      return sendError(res, 'Bài đăng không còn khả dụng để nhận', 400);
    }

    // Check if user is requesting their own post
    if (postExists.donorId.toString() === req.user._id.toString()) {
      return sendError(res, 'Bạn không thể nhận lại món ăn của chính mình', 400);
    }

    // Check if request already exists from this user for this post
    const existingRequest = await Request.findOne({
      postId,
      receiverId: req.user._id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return sendError(res, 'Bạn đã gửi yêu cầu cho bài đăng này rồi', 400);
    }

    const request = await Request.create({
      postId,
      donorId: postExists.donorId,
      receiverId: req.user._id,
      requestedQty,
      message,
      status: 'pending'
    });

    return sendSuccess(res, request, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get request details/status
 * @route GET /api/v1/requests/:id
 * @access Private
 */
export const getRequestStatus = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('postId', 'title description quantity images status location')
      .populate('donorId', 'fullName phone avatar')
      .populate('receiverId', 'fullName phone avatar');

    if (!request) {
      return sendError(res, 'Yêu cầu không tồn tại', 404);
    }

    // Access control: only receiver or donor can view this request
    const isReceiver = request.receiverId._id.toString() === req.user._id.toString();
    const isDonor = request.donorId._id.toString() === req.user._id.toString();

    if (!isReceiver && !isDonor) {
      return sendError(res, 'Không có quyền truy cập yêu cầu này', 403);
    }

    return sendSuccess(res, request);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Cancel a request
 * @route POST /api/v1/requests/:id/cancel
 * @access Private
 */
export const cancelRequest = async (req, res, next) => {
  try {
    const { error } = cancelRequestSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { reason = '' } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return sendError(res, 'Yêu cầu không tồn tại', 404);
    }

    // Only receiver can cancel request (as per prompt "User hủy yêu cầu")
    if (request.receiverId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Bạn không có quyền hủy yêu cầu này', 403);
    }

    if (request.status !== 'pending') {
      return sendError(res, 'Chỉ có thể hủy yêu cầu đang ở trạng thái chờ', 400);
    }

    request.status = 'cancelled';
    request.cancelledBy = req.user._id;
    request.cancelReason = reason;

    await request.save();

    return sendSuccess(res, request, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Accept a request (for donor)
 * @route POST /api/v1/requests/:id/accept
 * @access Private
 */
export const acceptRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return sendError(res, 'Yêu cầu không tồn tại', 404);
    }

    if (request.donorId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Bạn không phải chủ món ăn để duyệt yêu cầu này', 403);
    }

    if (request.status !== 'pending') {
      return sendError(res, 'Yêu cầu này không còn ở trạng thái chờ', 400);
    }

    const post = await FoodPost.findById(request.postId);
    if (!post) {
      return sendError(res, 'Bài viết không tồn tại', 404);
    }

    request.status = 'accepted';
    await request.save();

    // Lock/Reserv post status
    post.status = 'reserved';
    await post.save();

    // Automatically reject other requests for this post
    await Request.updateMany(
      { postId: request.postId, _id: { $ne: request._id }, status: 'pending' },
      { $set: { status: 'rejected' } }
    );

    // Create a transaction record to bridge reviews
    await Transaction.create({
      requestId: request._id,
      postId: post._id,
      donorId: post.donorId,
      receiverId: request.receiverId,
      quantity: request.requestedQty || 1,
      unit: post.unit || 'item',
      status: 'active'
    });

    return sendSuccess(res, request, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Reject a request (for donor)
 * @route POST /api/v1/requests/:id/reject
 * @access Private
 */
export const rejectRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return sendError(res, 'Yêu cầu không tồn tại', 404);
    }

    if (request.donorId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Bạn không phải chủ món ăn để duyệt yêu cầu này', 403);
    }

    if (request.status !== 'pending') {
      return sendError(res, 'Yêu cầu này không thể từ chối vì đã thay đổi trạng thái', 400);
    }

    request.status = 'rejected';
    await request.save();

    return sendSuccess(res, request, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get user transaction history (completed/cancelled requests)
 * @route GET /api/v1/users/me/transactions
 * @access Private
 */
export const getUserTransactions = async (req, res, next) => {
  try {
    const { type = 'shared' } = req.query;
    const userId = req.user._id;

    let query = {
      status: { $in: ['completed', 'cancelled'] }
    };

    if (type === 'shared') {
      query.donorId = userId;
    } else if (type === 'received') {
      query.receiverId = userId;
    } else {
      // If prompt suggests return mixed, include both? Standard allows querying or returning shared/received with logical OR inside matching group.
      // But query says filter is usually querying either shared or received!
      query.$or = [{ donorId: userId }, { receiverId: userId }];
    }

    const requests = await Request.find(query)
      .populate('postId', 'title description images status location')
      .populate('donorId', 'fullName avatar')
      .populate('receiverId', 'fullName avatar')
      .sort({ updatedAt: -1 });

    return sendSuccess(res, requests);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all requests for a single post (for donor to review claimants)
 * @route GET /api/v1/requests/post/:postId
 * @access Private
 */
export const getPostRequests = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const postExists = await FoodPost.findById(postId);
    if (!postExists) {
      return sendError(res, 'Bài viết không tồn tại', 404);
    }

    if (postExists.donorId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Bạn không phải chủ món ăn để coi danh sách này', 403);
    }

    const requests = await Request.find({ postId: postId })
      .populate('receiverId', 'fullName avatar phone')
      .sort({ createdAt: -1 });

    return sendSuccess(res, requests);
  } catch (error) {
    next(error);
  }
};

