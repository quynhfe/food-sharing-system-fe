import Wishlist from '../models/Wishlist.js';
import FoodPost from '../models/FoodPost.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';

/**
 * @desc Add a post to wishlist
 * @route POST /api/v1/wishlist
 * @access Private
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return sendError(res, 'postId là bắt buộc', 400);
    }

    // Check if post exists
    const post = await FoodPost.findById(postId);
    if (!post) {
      return sendError(res, 'Bài đăng không tồn tại', 404);
    }

    // Check for duplicate
    const existing = await Wishlist.findOne({ userId: req.user._id, postId });
    if (existing) {
      return sendError(res, 'Bài đăng đã có trong danh sách yêu thích', 409);
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user._id,
      postId,
    });

    return sendSuccess(res, wishlistItem, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get user's wishlist with pagination & optional search
 * @route GET /api/v1/wishlist
 * @access Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Build pipeline to join with FoodPost and optionally filter by title
    let pipeline = [
      { $match: { userId: req.user._id } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'foodposts',
          localField: 'postId',
          foreignField: '_id',
          as: 'post',
        },
      },
      { $unwind: { path: '$post', preserveNullAndEmptyArrays: false } },
    ];

    // Search filter on post title
    if (search) {
      pipeline.push({
        $match: {
          'post.title': { $regex: search, $options: 'i' },
        },
      });
    }

    // Lookup donor info
    pipeline.push(
      {
        $lookup: {
          from: 'users',
          localField: 'post.donorId',
          foreignField: '_id',
          as: 'post.donor',
        },
      },
      {
        $unwind: { path: '$post.donor', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          'post.donor.passwordHash': 0,
          'post.donor.resetPasswordToken': 0,
          'post.donor.resetPasswordExpires': 0,
          'post.donor.__v': 0,
        },
      }
    );

    // Facet for pagination
    pipeline.push({
      $facet: {
        items: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    });

    const result = await Wishlist.aggregate(pipeline);
    const items = result[0].items;
    const total = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const totalPages = Math.ceil(total / limit);

    return sendSuccess(res, {
      wishlists: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Remove from wishlist
 * @route DELETE /api/v1/wishlist/:id
 * @access Private
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return sendError(res, 'Không tìm thấy trong danh sách yêu thích', 404);
    }

    return sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Check if a post is in user's wishlist
 * @route GET /api/v1/wishlist/check/:postId
 * @access Private
 */
export const checkWishlist = async (req, res, next) => {
  try {
    const item = await Wishlist.findOne({
      userId: req.user._id,
      postId: req.params.postId,
    });

    return sendSuccess(res, {
      wishlisted: !!item,
      wishlistId: item?._id || null,
    });
  } catch (err) {
    next(err);
  }
};
