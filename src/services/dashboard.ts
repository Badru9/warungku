import apiClient from '@/lib/api/client';

export interface DashboardSummary {
  totalProducts: number;
  lowStock: number;
  transactionsToday: number;
}

export interface ChartDataPoint {
  created_at: string;
  type: 'IN' | 'OUT';
  quantity: number;
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    return apiClient.get('/dashboard/summary');
  },

  getChartData: async (period: 'weekly' | 'monthly' = 'weekly'): Promise<ChartDataPoint[]> => {
    return apiClient.get(`/dashboard/chart?period=${period}`);
  },
};
