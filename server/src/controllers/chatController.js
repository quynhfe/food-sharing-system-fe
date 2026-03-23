import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Transaction from '../models/Transaction.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';

/**
 * @desc  Find the conversation tied to a specific food post for the current user.
 *        Works for both the donor (post owner) and the receiver (requester).
 * @route GET /api/v1/chats/by-post/:postId
 * @access Private
 */
export const getConversationByPost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    // Find a transaction for this post that involves the current user
    const transaction = await Transaction.findOne({
      postId,
      $or: [{ donorId: userId }, { receiverId: userId }],
    });

    if (!transaction) {
      return sendError(res, 'Chưa có cuộc trò chuyện nào cho bài đăng này', 404);
    }

    // Find the conversation linked to this transaction
    const conversation = await Conversation.findOne({ transactionId: transaction._id })
      .populate('donorId', 'fullName avatar')
      .populate('receiverId', 'fullName avatar')
      .populate({
        path: 'transactionId',
        populate: { path: 'postId', model: 'FoodPost', select: 'title images' },
      });

    if (!conversation) {
      return sendError(res, 'Không tìm thấy cuộc trò chuyện', 404);
    }

    const isUserDonor = conversation.donorId._id.toString() === userId.toString();
    const otherUser = isUserDonor ? conversation.receiverId : conversation.donorId;
    const post = conversation.transactionId?.postId;

    return sendSuccess(res, {
      _id: conversation._id,
      otherUser: { _id: otherUser._id, fullName: otherUser.fullName, avatar: otherUser.avatar },
      postTitle: post?.title || '',
      postImage: post?.images?.[0] || null,
      lastMessage: conversation.lastMessage,
      status: conversation.status,
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Get all conversations for the logged-in user
 * @route GET /api/v1/chats
 * @access Private
 */
export const getChats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      $or: [{ donorId: userId }, { receiverId: userId }],
    })
      .populate('donorId', 'fullName avatar')
      .populate('receiverId', 'fullName avatar')
      .populate({
        path: 'transactionId',
        populate: {
          path: 'postId',
          model: 'FoodPost',
          select: 'title images',
        },
      })
      .sort({ updatedAt: -1 });

    const formatted = conversations.map((conv) => {
      const isUserDonor = conv.donorId._id.toString() === userId.toString();
      const otherUser = isUserDonor ? conv.receiverId : conv.donorId;
      const post = conv.transactionId?.postId;

      return {
        _id: conv._id,
        otherUser: {
          _id: otherUser._id,
          fullName: otherUser.fullName,
          avatar: otherUser.avatar,
        },
        postTitle: post?.title || 'Không rõ',
        postImage: post?.images?.[0] || null,
        lastMessage: conv.lastMessage,
        status: conv.status,
        updatedAt: conv.updatedAt,
      };
    });

    return sendSuccess(res, formatted);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Get messages for a specific conversation
 * @route GET /api/v1/chats/:id/messages
 * @access Private
 */
export const getChatMessages = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Verify user is part of this conversation and populate user + post info
    const conversation = await Conversation.findOne({
      _id: id,
      $or: [{ donorId: userId }, { receiverId: userId }],
    })
      .populate('donorId', 'fullName avatar')
      .populate('receiverId', 'fullName avatar')
      .populate({
        path: 'transactionId',
        populate: {
          path: 'postId',
          model: 'FoodPost',
          select: 'title images',
        },
      });

    if (!conversation) {
      return sendError(res, 'Không tìm thấy cuộc trò chuyện', 404);
    }

    const messages = await Message.find({ conversationId: id })
      .populate('senderId', 'fullName avatar')
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Mark unread messages as read
    await Message.updateMany(
      { conversationId: id, senderId: { $ne: userId }, isRead: false },
      { isRead: true }
    );

    // Build a clean object with populated data
    const isUserDonor = conversation.donorId._id.toString() === userId.toString();
    const otherUser = isUserDonor ? conversation.receiverId : conversation.donorId;
    const post = conversation.transactionId?.postId;

    const conversationInfo = {
      _id: conversation._id,
      transactionId: conversation.transactionId?._id ?? conversation.transactionId,
      requestId: conversation.transactionId?.requestId ?? null,
      donorId: conversation.donorId._id,
      receiverId: conversation.receiverId._id,
      status: conversation.status,
      otherUser: {
        _id: otherUser._id,
        fullName: otherUser.fullName,
        avatar: otherUser.avatar,
      },
      postTitle: post?.title || '',
      postImage: post?.images?.[0] || null,
    };

    return sendSuccess(res, { messages, conversation: conversationInfo });
  } catch (error) {
    next(error);
  }
};
