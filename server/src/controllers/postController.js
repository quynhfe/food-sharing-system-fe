import FoodPost from '../models/FoodPost.js';
import { getPostsQuerySchema, createPostSchema, updatePostSchema, getPostsForMapQuerySchema } from '../validators/postValidator.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';
import { getFileUrl } from '../services/uploadService.js';

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

    const { page, limit, search, category, filter, latitude, longitude, maxDistance } = value;
    const skip = (page - 1) * limit;

    let matchStage = {
      status: 'active',
      expirationDate: { $gt: new Date() } // Only getting unexpired food
    };

    if (category) {
      matchStage.category = category;
    }

    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
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
      // For 'expiring' filter, only show posts expiring within 24 hours
      const expiringStageMath = filter === 'expiring'
        ? { ...matchStage, expirationDate: { $gt: new Date(), $lt: new Date(Date.now() + 24 * 60 * 60 * 1000) } }
        : matchStage;

      pipeline.push({ $match: expiringStageMath });
      
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
 * @access Private
 */
export const createPost = async (req, res, next) => {
  try {
    const { error, value } = createPostSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    // Process uploaded images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        imageUrls.push(getFileUrl(req, file.filename));
      });
    }

    const {
      title,
      description,
      category,
      quantity,
      unit,
      expirationDate,
      locationText,
      latitude,
      longitude,
    } = value;

    const post = await FoodPost.create({
      donorId: req.user._id,
      title,
      description,
      category,
      quantity,
      unit,
      expirationDate,
      location: {
        detail: locationText,
        coordinates: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
      images: imageUrls,
      status: 'active',
    });

    return sendSuccess(res, post, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get details of a single post
 * @route GET /api/v1/posts/:id
 * @access Public
 */
export const getPostDetails = async (req, res, next) => {
  try {
    const post = await FoodPost.findById(req.params.id)
      .populate('donorId', 'fullName avatar email')
      .lean();

    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    // Mock trust score and previous shares since it's not in DB yet
    post.donor = {
      ...post.donorId,
      trustScore: 94,
      sharesCount: 23,
    };
    delete post.donorId;

    return sendSuccess(res, post);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get map markers for active posts
 * @route GET /api/v1/posts/map
 * @access Public
 */
export const getPostsForMap = async (req, res, next) => {
  try {
    const { error, value } = getPostsForMapQuerySchema.validate(req.query);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { latitude, longitude, radius } = value;

    const posts = await FoodPost.find({
      status: 'active',
      expirationDate: { $gt: new Date() },
      'location.coordinates': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius,
        },
      },
    })
      .select('_id title category location donorId images')
      .populate('donorId', 'fullName avatar');

    return sendSuccess(res, posts);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get all posts by the logged in user
 * @route GET /api/v1/posts/me
 * @access Private
 */
export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await FoodPost.find({ donorId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, posts);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update a post
 * @route PUT /api/v1/posts/:id
 * @access Private
 */
export const updatePost = async (req, res, next) => {
  try {
    const { error, value } = updatePostSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400);

    const post = await FoodPost.findById(req.params.id);
    if (!post) return sendError(res, 'Post not found', 404);

    if (post.donorId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to update this post', 403);
    }

    if (value.latitude && value.longitude) {
      value.location = {
        detail: value.locationText || post.location.detail,
        coordinates: {
          type: 'Point',
          coordinates: [value.longitude, value.latitude],
        },
      };
      delete value.latitude;
      delete value.longitude;
      delete value.locationText;
    }

    const updatedPost = await FoodPost.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, updatedPost);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Delete a post
 * @route DELETE /api/v1/posts/:id
 * @access Private
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await FoodPost.findById(req.params.id);
    if (!post) return sendError(res, 'Post not found', 404);

    if (post.donorId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to delete this post', 403);
    }

    await FoodPost.findByIdAndDelete(req.params.id);

    return sendSuccess(res, null, 204);
  } catch (err) {
    next(err);
  }
};
