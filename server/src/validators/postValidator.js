import Joi from 'joi';

export const getPostsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  search: Joi.string().allow('').optional(),
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
