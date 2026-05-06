import apiClient from '@/lib/api/client';
import { setAuthToken, removeAuthToken, AUTH_TOKEN_KEY } from '@/lib/api/auth';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
  profile: {
    id: string;
    full_name: string;
    role: string;
    is_active: boolean;
  };
}

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    setAuthToken(response.token);
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      removeAuthToken();
    }
  },

  getProfile: async (): Promise<Profile> => {
    return apiClient.get('/auth/profile');
  },

  // For checking if token exists (synchronous)
  isLoggedIn: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
};