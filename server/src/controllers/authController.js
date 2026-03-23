import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';
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
 * @desc Forgot password – generate 6-digit OTP and send email
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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP and save to DB
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    // Set expire (10 minutes)
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Send email with OTP
    try {
      await sendPasswordResetEmail(user.email, otp, user.fullName);
      return sendSuccess(res, {
        message: `Mã OTP đã được gửi đến email ${user.email}`,
      });
    } catch (emailError) {
      // If email fails, rollback token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error('Email send error:', emailError);
      return sendError(res, 'Không thể gửi email. Vui lòng thử lại sau.', 500);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Verify OTP (without resetting password yet)
 * @route POST /api/v1/auth/verify-otp
 * @access Public
 */
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return sendError(res, 'Email và mã OTP là bắt buộc', 400);
    }

    // Hash the incoming OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedOtp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, 'Mã OTP không hợp lệ hoặc đã hết hạn', 400);
    }

    // OTP is valid — return a short-lived "verified" token so FE can proceed to reset
    // We keep resetPasswordToken intact until password is actually reset
    return sendSuccess(res, {
      message: 'Mã OTP hợp lệ',
      resetToken: req.body.otp, // raw OTP used as reset token for next step
      email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Reset password using OTP
 * @route PUT /api/v1/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { email, otp, password } = req.body;

    if (!email || !otp) {
      return sendError(res, 'Email và OTP là bắt buộc', 400);
    }

    // Hash OTP to compare
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedOtp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, 'Mã OTP không hợp lệ hoặc đã hết hạn', 400);
    }

    // Set new password
    user.passwordHash = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return sendSuccess(res, {
      message: 'Mật khẩu đã được thay đổi thành công. Vui lòng đăng nhập lại.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Logout user (client-side token removal)
 * @route POST /api/v1/auth/logout
 * @access Public
 */
export const logoutUser = async (req, res, next) => {
  try {
    return sendSuccess(res, { message: 'Đăng xuất thành công' });
  } catch (error) {
    next(error);
  }
};
