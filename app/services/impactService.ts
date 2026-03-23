import apiClient from './api-client';

export interface ImpactStats {
  totalShared: number;
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

export const impactService = {
  getStats: async (period: PeriodFilter = 'all'): Promise<ImpactStats> => {
    const res = await apiClient.get(`/impact/stats?period=${period}`);
    return res.data.data;
  },

  getChart: async (): Promise<ChartMonth[]> => {
    const res = await apiClient.get('/impact/chart');
    return res.data.data.chart;
  },
};
