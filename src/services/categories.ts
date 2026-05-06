import apiClient from '@/lib/api/client';

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get('/categories');
  },

  createCategory: async (name: string): Promise<Category> => {
    return apiClient.post('/categories', { name });
  },
};
