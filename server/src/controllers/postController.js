import FoodPost from '../models/FoodPost.js';
import { getPostsQuerySchema } from '../validators/postValidator.js';
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

    const { page, limit, search, filter, latitude, longitude, maxDistance } = value;
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
