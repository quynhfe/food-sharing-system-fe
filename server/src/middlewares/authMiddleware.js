import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../helpers/responseHelper.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        return sendError(res, 'Không tìm thấy người dùng', 401);
      }

      next();
    } catch (error) {
      return sendError(res, 'Token không hợp lệ hoặc đã hết hạn', 401);
    }
  }

  if (!token) {
    return sendError(res, 'Không có token xác thực', 401);
  }
};

/**
 * Require authenticated admin user.
 * - Assumes `protect` middleware has already set `req.user`.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) return sendError(res, 'Không có thông tin người dùng', 401);
  if (req.user.role !== 'admin') return sendError(res, 'Không có quyền', 403);
  next();
};
