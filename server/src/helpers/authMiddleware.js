/**
 * Re-use JWT auth — do not bypass with User.findOne() or all posts attach to the wrong user.
 */
export { protect } from '../middlewares/authMiddleware.js';
