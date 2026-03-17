import * as userService from '../services/userService.js';
import { registerSchema } from '../validators/userValidator.js';

/**
 * @desc Get all users
 * @route GET /api/v1/users
 * @access Public
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Register a user
 * @route POST /api/v1/users/register
 * @access Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, email, password, role } = req.body;
    const user = await userService.createUser({ name, email, password, role });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
