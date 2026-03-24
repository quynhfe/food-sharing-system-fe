import apiClient from './api-client';

export interface ImpactStats {
  totalShared: number;
  /** Bài đăng của tôi (không tính deleted) — API GET /impact/stats */
  postsSharedCount?: number;
  /** Số lần nhận khi giao dịch completed */
  receivedCompletedCount?: number;
  /** kg đã nhận (Transaction completed, receiver) */
  rescuedKg?: number;
  totalFoodKg: number;
  totalCo2Kg: number;
  level: number;
  levelName: string;
  nextLevelName: string | null;
  exp: number;
  expPercent: number;
  sharesNeeded: number;
}

export interface ChartMonth {
  month: string;
  count: number;
}

export interface ImpactChart {
  chart: ChartMonth[];
}

export type PeriodFilter = 'week' | 'month' | 'all';

function normalizeImpactStats(raw: unknown): ImpactStats {
  const d = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const num = (v: unknown, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    totalShared: num(d.totalShared),
    postsSharedCount:
      d.postsSharedCount !== undefined ? num(d.postsSharedCount) : undefined,
    receivedCompletedCount: num(d.receivedCompletedCount),
    rescuedKg: num(d.rescuedKg),
    totalFoodKg: num(d.totalFoodKg),
    totalCo2Kg: num(d.totalCo2Kg),
    level: num(d.level, 1) || 1,
    levelName: typeof d.levelName === 'string' ? d.levelName : 'Người mới',
    nextLevelName:
      typeof d.nextLevelName === 'string' ? d.nextLevelName : null,
    exp: num(d.exp),
    expPercent: num(d.expPercent),
    sharesNeeded: num(d.sharesNeeded),
  };
}

export const impactService = {
  getStats: async (period: PeriodFilter = 'all'): Promise<ImpactStats> => {
    const res = await apiClient.get(`/impact/stats?period=${period}`);
    return normalizeImpactStats(res.data?.data);
  },

  getChart: async (): Promise<ChartMonth[]> => {
    const res = await apiClient.get('/impact/chart');
    return res.data.data.chart;
  },
};
