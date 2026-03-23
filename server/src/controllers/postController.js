import FoodPost from '../models/FoodPost.js';
import { getPostsQuerySchema, createPostSchema, updatePostSchema } from '../validators/postValidator.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';

/**
 * @desc Get all posts with pagination, search, and filters
 * @route GET /api/v1/posts
 * @access Public
 */
export const getPosts = async (req, res, next) => {
  try {
    const { error, value } = getPostsQuerySchema.validate(req.query);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { page, limit, search, filter, category, latitude, longitude, maxDistance } = value;
    const skip = (page - 1) * limit;

    let matchStage = {
      status: 'active',
      expirationDate: { $gt: new Date() } // Only getting unexpired food
    };

    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      matchStage.category = category;
    }

    let pipeline = [];

    // Geo spatial search needs to be the first stage in pipeline
    if (filter === 'nearby') {
      pipeline.push({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          distanceField: 'calculatedDistance',
          maxDistance: maxDistance,
          spherical: true,
          query: matchStage
        }
      });
    } else {
      pipeline.push({ $match: matchStage });
      
      // Sorting based on filter
      if (filter === 'expiring') {
        pipeline.push({ $sort: { expirationDate: 1 } });
      } else { // default to 'newest'
        pipeline.push({ $sort: { createdAt: -1 } });
      }
    }

    // Add lookup for donor details
    pipeline.push(
      {
        $lookup: {
          from: 'users',
          localField: 'donorId',
          foreignField: '_id',
          as: 'donor'
        }
      },
      {
        $unwind: {
          path: '$donor',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          'donor.passwordHash': 0,
          'donor.resetPasswordToken': 0,
          'donor.resetPasswordExpires': 0,
          'donor.__v': 0
        }
      }
    );

    // Facet for pagination and total count
    pipeline.push({
      $facet: {
        posts: [
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      }
    });

    const result = await FoodPost.aggregate(pipeline);
    
    const posts = result[0].posts;
    const total = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const totalPages = Math.ceil(total / limit);

    return sendSuccess(res, {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    });

  } catch (err) {
    next(err);
  }
};

/**
 * @desc Create a new food post
 * @route POST /api/v1/posts
 * @access Private (Donor)
 */
export const createPost = async (req, res, next) => {
  try {
    const { error, value } = createPostSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const newPost = new FoodPost({
      ...value,
      donorId: req.user._id,
      availableQuantity: value.quantity
    });

    await newPost.save();
    return sendSuccess(res, newPost, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get single post by ID
 * @route GET /api/v1/posts/:id
 * @access Public
 */
export const getPostById = async (req, res, next) => {
  try {
    const post = await FoodPost.findById(req.params.id).populate('donorId', 'fullName avatar trustScore');
    if (!post) {
      return sendError(res, 'Không tìm thấy bài đăng', 404);
    }
    return sendSuccess(res, post);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get posts by logged-in user with pending requests count
 * @route GET /api/v1/posts/me
 * @access Private
 */
export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await FoodPost.aggregate([
      { $match: { donorId: req.user._id } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'requests',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$postId', '$$postId'] },
                    { $eq: ['$status', 'pending'] }
                  ]
                }
              }
            }
          ],
          as: 'pendingRequests'
        }
      },
      {
        $addFields: {
          pendingRequestsCount: { $size: '$pendingRequests' }
        }
      },
      {
        $project: {
          pendingRequests: 0
        }
      }
    ]);

    return sendSuccess(res, posts);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update a food post
 * @route PUT /api/v1/posts/:id
 * @access Private (Owner)
 */
export const updatePost = async (req, res, next) => {
  try {
    const { error, value } = updatePostSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const post = await FoodPost.findById(req.params.id);
    if (!post) {
      return sendError(res, 'Không tìm thấy bài đăng', 404);
    }

    if (post.donorId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Không có quyền cập nhật bài đăng này', 403);
    }

    // Only allow update if not marked as completed or deleted
    if (post.status === 'completed' || post.status === 'deleted') {
      return sendError(res, 'Không thể cập nhật bài đăng đã hoàn tất hoặc bị xoá', 400);
    }

    const updatedPost = await FoodPost.findByIdAndUpdate(
      req.params.id,
      { $set: value },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, updatedPost);
  } catch (err) {
    next(err);
  }
};
