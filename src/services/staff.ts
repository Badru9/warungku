import apiClient from '@/lib/api/client';

export interface Staff {
  id: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateStaffPayload {
  full_name: string;
  email: string;
  password: string;
}

export const staffService = {
  getStaff: async (): Promise<Staff[]> => {
    return apiClient.get('/staff');
  },

  createStaff: async (payload: CreateStaffPayload): Promise<Staff> => {
    return apiClient.post('/staff', payload);
  },
};