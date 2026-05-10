import apiClient from '@/lib/api/client';

export type DebtStatus = 'UNPAID' | 'PARTIAL' | 'PAID';

export interface DebtRecord {
  id: string;
  customer_id: string;
  amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: DebtStatus;
  due_date?: string | null;
  note?: string | null;
  created_at: string;
  customers?: {
    name: string;
    phone?: string | null;
  };
}

export interface CreateDebtPayload {
  customer_id: string;
  amount: number;
  paid_amount?: number;
  due_date?: string;
  note?: string;
}

export interface DebtFilters {
  status?: DebtStatus;
  customer_id?: string;
}

export const debtsService = {
  getDebts: async (filters?: DebtFilters): Promise<DebtRecord[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.customer_id) params.append('customer_id', filters.customer_id);

    const query = params.toString();
    return apiClient.get(`/debts${query ? `?${query}` : ''}`);
  },

  createDebt: async (payload: CreateDebtPayload): Promise<DebtRecord> => {
    return apiClient.post('/debts', payload);
  },
};
