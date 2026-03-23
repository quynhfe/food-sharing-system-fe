import Request from '../models/Request.js';
import FoodPost from '../models/FoodPost.js';
import User from '../models/User.js';
import ImpactRecord from '../models/ImpactRecord.js';
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
// Meals per kg
const MEALS_PER_KG = 3;

function toKg(quantity, unit) {
  return quantity * (UNIT_WEIGHT[unit] ?? 0.5);
}

/**
 * @desc  Get impact stats for a user
 * @route GET /api/v1/impact/user/:id?period=week|month|all
 * @route GET /api/v1/impact/stats?period=week|month|all (backward comp)
 * @access Private
 */
export const getImpactStats = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user._id;
    const { period = 'all' } = req.query;

    let dateFilter = {};
    const now = new Date();
    if (period === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { createdAt: { $gte: monthAgo } };
    }

    // Count posts donated (any status) — shows immediately after posting
    const totalShared = await FoodPost.countDocuments({
      donorId: userId,
      ...dateFilter,
    });

    // Aggregate completed impact records for kg/co2 metrics
    const impacts = await ImpactRecord.find({
      donorId: userId,
      ...dateFilter,
    });

    let totalMealsShared = 0;
    let totalFoodKg = 0;
    let totalCo2Kg = 0;

    for (const impact of impacts) {
      totalMealsShared += impact.mealsShared || 0;
      totalFoodKg += impact.foodSavedKg || 0;
      totalCo2Kg += impact.co2ReducedKg || 0;
    }

    const user = await User.findById(userId).select('exp');
    const exp = user?.exp ?? 0;
    const levelInfo = getLevelInfo(exp);

    return sendSuccess(res, {
      totalShared,
      totalMealsShared: parseFloat(totalMealsShared.toFixed(2)),
      totalFoodKg: parseFloat(totalFoodKg.toFixed(2)),
      totalCo2Kg: parseFloat(totalCo2Kg.toFixed(2)),
      ...levelInfo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Get global impact stats
 * @route GET /api/v1/impact/global
 * @access Public
 */
export const getGlobalImpact = async (req, res, next) => {
  try {
    const impacts = await ImpactRecord.find();
    let totalMealsShared = 0;
    let totalFoodKg = 0;
    let totalCo2Kg = 0;
    
    // We only count each impact record once (it includes both donor and receiver inherently)
    for (const impact of impacts) {
        totalMealsShared += impact.mealsShared || 0;
        totalFoodKg += impact.foodSavedKg || 0;
        totalCo2Kg += impact.co2ReducedKg || 0;
    }

    return sendSuccess(res, {
        totalTransactions: impacts.length,
        totalMealsShared: parseFloat(totalMealsShared.toFixed(2)),
        totalFoodKg: parseFloat(totalFoodKg.toFixed(2)),
        totalCo2Kg: parseFloat(totalCo2Kg.toFixed(2))
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
