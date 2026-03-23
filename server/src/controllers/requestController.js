import Request from '../models/Request.js';
import Conversation from '../models/Conversation.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';

/**
 * @desc  Mark a request as completed
 * @route PUT /api/v1/requests/:id/complete
 * @access Private
 */
export const completeRequest = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const request = await Request.findById(id);

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

    // Close the linked conversation
    await Conversation.findOneAndUpdate(
      { transactionId: request._id },
      { status: 'closed' }
    );

    return sendSuccess(res, { message: 'Giao dịch đã được đánh dấu hoàn tất', request });
  } catch (error) {
    next(error);
  }
};
