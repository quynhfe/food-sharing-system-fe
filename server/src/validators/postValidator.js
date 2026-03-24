import Joi from 'joi';

export const getPostsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  search: Joi.string().allow('').optional(),
  category: Joi.string().valid('cooked', 'raw', 'packaged', 'other').optional(),
  filter: Joi.string().valid('nearby', 'expiring', 'newest').default('newest'),
  latitude: Joi.number().min(-90).max(90).when('filter', {
    is: 'nearby',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  longitude: Joi.number().min(-180).max(180).when('filter', {
    is: 'nearby',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  maxDistance: Joi.number().min(0).default(10000) // Default 10km
});

export const createPostSchema = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string().trim().optional(),
  category: Joi.string().valid('cooked', 'raw', 'packaged', 'other').required(),
  quantity: Joi.number().min(1).required(),
  unit: Joi.string().valid('kg', 'portion', 'box', 'item').required(),
  expirationDate: Joi.date().greater('now').required(),
  locationText: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  category: Joi.string().valid('cooked', 'raw', 'packaged', 'other').optional(),
  quantity: Joi.number().min(1).optional(),
  unit: Joi.string().valid('kg', 'portion', 'box', 'item').optional(),
  expirationDate: Joi.date().greater('now').optional(),
  locationText: Joi.string().optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
});

export const getPostsForMapQuerySchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  radius: Joi.number().min(100).max(50000).default(10000) // Default 10km
});
