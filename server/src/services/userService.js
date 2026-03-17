import User from '../models/User.js';

/**
 * @desc Get all users
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
  return await User.find();
};

/**
 * @desc Create a new user
 * @param {Object} userData 
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
  return await User.create(userData);
};

/**
 * @desc Get user by email
 * @param {string} email 
 * @returns {Promise<Object>}
 */
export const getUserByEmail = async (email) => {
  return await User.findOne({ email }).select('+password');
};
