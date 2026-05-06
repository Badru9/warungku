import apiClient from '@/lib/api/client';

export interface Transaction {
  id: string;
  product_id: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  stock_before: number;
  stock_after: number;
  price_at_time: number;
  note?: string;
  created_by: string;
  created_at: string;
  products?: {
    name: string;
    unit: string;
  };
  profiles?: {
    full_name: string;
  };
}

export interface CreateTransactionPayload {
  product_id: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  note?: string;
}

export interface TransactionFilters {
  product_id?: string;
  type?: 'IN' | 'OUT' | 'ADJUST';
}

export const transactionsService = {
  getTransactions: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters?.product_id) params.append('product_id', filters.product_id);
    if (filters?.type) params.append('type', filters.type);

    const query = params.toString();
    return apiClient.get(`/transactions${query ? `?${query}` : ''}`);
  },

  createTransaction: async (payload: CreateTransactionPayload): Promise<Transaction> => {
    return apiClient.post('/transactions', payload);
  },
};