import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';
import crypto from 'crypto';

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { fullName, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 'Email đã được sử dụng', 400);
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      passwordHash: password, // The pre-save hook will hash this
      phone,
    });

    if (user) {
      return sendSuccess(res, {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      }, 201);
    } else {
      return sendError(res, 'Dữ liệu người dùng không hợp lệ', 400);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Auth user & get token
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { email, password } = req.body;

    // Find the user and include passwordHash
    const user = await User.findOne({ email }).select('+passwordHash');

    if (user && (await user.matchPassword(password))) {
      return sendSuccess(res, {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      return sendError(res, 'Email hoặc mật khẩu không chính xác', 401);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Forgot password
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return sendError(res, 'Không tìm thấy người dùng với email này', 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (10 minutes)
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // In production, send email here. For now, return token in response (for testing/mobile flow)
    return sendSuccess(res, {
      message: 'Email khôi phục mật khẩu đã được xử lý (Mock)',
      resetToken: resetToken // Only returning this for dev ease
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Reset password
 * @route PUT /api/v1/auth/reset-password/:resettoken
 * @access Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, 'Token không hợp lệ hoặc đã hết hạn', 400);
    }

    // Set new password
    user.passwordHash = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return sendSuccess(res, {
      message: 'Mật khẩu đã được thay đổi thành công'
    });
  } catch (error) {
    next(error);
  }
};
