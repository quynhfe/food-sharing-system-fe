import Joi from 'joi';

export const createRequestSchema = Joi.object({
  postId: Joi.string().regex(/^[0-9a-fA-P]{24}$/).required().messages({
    'any.required': 'ID bài đăng là bắt buộc',
    'string.pattern.base': 'ID bài đăng không hợp lệ'
  }),
  requestedQty: Joi.number().min(1).optional(),
  message: Joi.string().max(200).optional().allow('', null)
});

export const cancelRequestSchema = Joi.object({
  reason: Joi.string().max(200).optional().allow('', null)
});
