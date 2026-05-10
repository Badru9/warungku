import apiClient from '@/lib/api/client';

export interface Customer {
  id: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  note?: string | null;
  total_debt?: number;
  created_at: string;
}

export interface CreateCustomerPayload {
  name: string;
  phone?: string;
  address?: string;
  note?: string;
}

export interface CustomerFilters {
  search?: string;
}

export const customersService = {
  getCustomers: async (filters?: CustomerFilters): Promise<Customer[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    return apiClient.get(`/customers${query ? `?${query}` : ''}`);
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    return apiClient.get(`/customers/${id}`);
  },

  createCustomer: async (payload: CreateCustomerPayload): Promise<Customer> => {
    return apiClient.post('/customers', payload);
  },
};
