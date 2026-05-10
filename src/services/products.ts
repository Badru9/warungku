import apiClient from '@/lib/api/client';

export interface Product {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  unit: string;
  buy_price: number;
  sell_price: number;
  current_stock: number;
  min_stock: number;
  deleted_at?: string;
  created_by?: string;
  categories?: {
    name: string;
  };
}

export interface ProductFilters {
  search?: string;
  category_id?: string;
  low_stock?: boolean;
}

export interface CreateProductPayload {
  name: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  unit: string;
  buy_price: number;
  sell_price: number;
  current_stock: number;
  min_stock: number;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  old_buy_price: number;
  new_buy_price: number;
  old_sell_price: number;
  new_sell_price: number;
  changed_at: string;
  changed_by: string;
  profiles?: {
    full_name: string;
  };
}

export const productsService = {
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category_id) params.append('category_id', filters.category_id);
    if (filters?.low_stock) params.append('low_stock', 'true');

    const query = params.toString();
    return apiClient.get(`/products${query ? `?${query}` : ''}`);
  },

  getProductById: async (id: string): Promise<Product> => {
    return apiClient.get(`/products/${id}`);
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    return apiClient.post('/products', payload);
  },

  updateProduct: async (
    id: string,
    payload: Partial<CreateProductPayload>,
  ): Promise<Product> => {
    return apiClient.patch(`/products/${id}`, payload);
  },

  deleteProduct: async (id: string): Promise<void> => {
    return apiClient.delete(`/products/${id}`);
  },

  getPriceHistory: async (id: string): Promise<PriceHistory[]> => {
    return apiClient.get(`/products/${id}/price-history`);
  },
};
