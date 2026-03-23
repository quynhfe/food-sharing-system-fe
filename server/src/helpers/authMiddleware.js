import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from './responseHelper.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decoded token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        return sendError(res, 'Người dùng không tồn tại', 401);
      }

      next();
    } catch (error) {
      console.error(error);
      return sendError(res, 'Không có quyền truy cập, token không hợp lệ', 401);
    }
  }

  if (!token) {
    return sendError(res, 'Không có token, không có quyền truy cập', 401);
  }
};
