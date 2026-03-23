import Request from '../models/Request.js';
import FoodPost from '../models/FoodPost.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../helpers/responseHelper.js';

// ─── Level Config ──────────────────────────────────────────────
// EXP thresholds for each level (cumulative)
export const LEVEL_CONFIG = [
  { level: 1, name: 'Người mới', minExp: 0 },
  { level: 2, name: 'Người chia sẻ', minExp: 100 },
  { level: 3, name: 'Người bảo vệ', minExp: 300 },
  { level: 4, name: 'Người tiên phong', minExp: 600 },
  { level: 5, name: 'Chiến binh xanh', minExp: 1000 },
  { level: 6, name: 'Anh hùng thực phẩm', minExp: 1500 },
];

export const EXP_PER_SHARE = 50; // EXP gained per completed share

export function getLevelInfo(exp) {
  let currentLevel = LEVEL_CONFIG[0];
  let nextLevel = LEVEL_CONFIG[1];

  for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_CONFIG[i].minExp) {
      currentLevel = LEVEL_CONFIG[i];
      nextLevel = LEVEL_CONFIG[i + 1] || null;
      break;
    }
  }

  let expPercent = 100;
  if (nextLevel) {
    const expInCurrentLevel = exp - currentLevel.minExp;
    const expNeededForNext = nextLevel.minExp - currentLevel.minExp;
    expPercent = Math.round((expInCurrentLevel / expNeededForNext) * 100);
  }

  const sharesNeeded = nextLevel
    ? Math.ceil((nextLevel.minExp - exp) / EXP_PER_SHARE)
    : 0;

  return {
    level: currentLevel.level,
    levelName: currentLevel.name,
    nextLevelName: nextLevel?.name || null,
    exp,
    expPercent,
    sharesNeeded,
  };
}

// ─── Conversion constants ──────────────────────────────────────
// Average weight per unit (in kg)
const UNIT_WEIGHT = { kg: 1, portion: 0.5, box: 1.5, item: 0.3 };
// kg CO2 saved per kg food (avoiding landfill)
const CO2_PER_KG = 2.5;

function toKg(quantity, unit) {
  return quantity * (UNIT_WEIGHT[unit] ?? 0.5);
}

/**
 * @desc  Get impact stats for the logged-in user
 * @route GET /api/v1/impact/stats?period=week|month|all
 * @access Private
 */
export const getImpactStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period = 'all' } = req.query;

    // Date filter
    let dateFilter = {};
    const now = new Date();
    if (period === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { updatedAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { updatedAt: { $gte: monthAgo } };
    }

    // Fetch completed requests where user is donor
    const completedRequests = await Request.find({
      donorId: userId,
      status: 'completed',
      ...dateFilter,
    }).populate('postId', 'quantity unit');

    const totalShared = completedRequests.length;

    let totalFoodKg = 0;
    for (const req of completedRequests) {
      const post = req.postId;
      if (post) {
        totalFoodKg += toKg(req.requestedQty, post.unit);
      }
    }

    const totalCo2Kg = parseFloat((totalFoodKg * CO2_PER_KG).toFixed(2));
    totalFoodKg = parseFloat(totalFoodKg.toFixed(2));

    // Get user EXP & level info
    const user = await User.findById(userId).select('exp');
    const exp = user?.exp ?? 0;
    const levelInfo = getLevelInfo(exp);

    return sendSuccess(res, {
      totalShared,
      totalFoodKg,
      totalCo2Kg,
      ...levelInfo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Get chart data for the last 6 months
 * @route GET /api/v1/impact/chart
 * @access Private
 */
export const getImpactChart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    const results = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const label = `T${start.getMonth() + 1}`;

      const count = await Request.countDocuments({
        donorId: userId,
        status: 'completed',
        updatedAt: { $gte: start, $lte: end },
      });

      results.push({ month: label, count });
    }

    return sendSuccess(res, { chart: results });
  } catch (error) {
    next(error);
  }
};
