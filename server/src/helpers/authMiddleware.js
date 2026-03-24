import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from './responseHelper.js';

export const protect = async (req, res, next) => {
  // TẠM THỜI BYPASS AUTH ĐỂ TEST (Do FE chưa làm xong Log In)
  req.user = await User.findOne() || { _id: '60d0fe4f5311236168a109ca' };
  if (req.user) return next();

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');

      req.user = await User.findById(decoded.id).select('-passwordHash');

      next();
    } catch (error) {
      console.error(error);
      return sendError(res, 'Không có quyền truy cập, token không hợp lệ', 401);
    }
  } else {
    return sendError(res, 'Không có quyền truy cập, không tìm thấy token', 401);
  }
};
