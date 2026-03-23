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
  title: Joi.string().required().trim().messages({
    'string.empty': 'Tiêu đề không được để trống',
    'any.required': 'Vui lòng nhập tiêu đề',
  }),
  description: Joi.string().allow('').trim(),
  category: Joi.string().valid('cooked', 'raw', 'packaged', 'other').required().messages({
    'any.only': 'Danh mục không hợp lệ',
    'any.required': 'Vui lòng chọn danh mục',
  }),
  quantity: Joi.number().min(0).required().messages({
    'number.base': 'Số lượng phải là số',
    'number.min': 'Số lượng không được âm',
    'any.required': 'Vui lòng nhập số lượng',
  }),
  unit: Joi.string().valid('kg', 'portion', 'box', 'item').required().messages({
    'any.only': 'Đơn vị không hợp lệ',
    'any.required': 'Vui lòng chọn đơn vị',
  }),
  expirationDate: Joi.date().iso().greater('now').required().messages({
    'date.base': 'Ngày hết hạn không hợp lệ',
    'date.greater': 'Ngày hết hạn phải ở tương lai',
    'any.required': 'Vui lòng nhập ngày hết hạn',
  }),
  location: Joi.object({
    province: Joi.string().required(),
    district: Joi.string().required(),
    detail: Joi.string().required(),
    coordinates: Joi.object({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).required() // [lng, lat]
    }).required()
  }).required().messages({
    'any.required': 'Vui lòng cung cấp vị trí đầy đủ',
  }),
  images: Joi.array().items(Joi.string()).max(5).optional()
});

export const updatePostSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().allow('').trim().optional(),
  category: Joi.string().valid('cooked', 'raw', 'packaged', 'other').optional(),
  quantity: Joi.number().min(0).optional(),
  unit: Joi.string().valid('kg', 'portion', 'box', 'item').optional(),
  expirationDate: Joi.date().iso().greater('now').optional(),
  location: Joi.object({
    province: Joi.string().required(),
    district: Joi.string().required(),
    detail: Joi.string().required(),
    coordinates: Joi.object({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).required()
    }).required()
  }).optional(),
  images: Joi.array().items(Joi.string()).max(5).optional(),
  status: Joi.string().valid('active', 'hidden', 'deleted').optional()
}).min(1).messages({
  'object.min': 'Phải cung cấp ít nhất một trường để cập nhật'
});
