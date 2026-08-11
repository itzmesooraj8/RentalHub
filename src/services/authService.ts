import { apiClient } from './apiClient';
import { User, UserRole } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password?: string; role?: UserRole; phone?: string; location?: string }): Promise<{ user: User; token: string }> {
    const payload = {
      ...data,
      password: data.password || 'password123',
    };
    const res = await apiClient.post<{ success: boolean; data: { user: User; token: string } }>('/api/auth/register', payload);
    localStorage.setItem('rentalhub_token', res.data.data.token);
    return res.data.data;
  },

  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    const res = await apiClient.post<{ success: boolean; data: { user: User; token: string } }>('/api/auth/login', {
      email,
      password: password || 'password123',
    });
    localStorage.setItem('rentalhub_token', res.data.data.token);
    return res.data.data;
  },

  async loginWithRole(role: UserRole): Promise<{ user: User; token: string }> {
    const res = await apiClient.post<{ success: boolean; data: { user: User; token: string } }>('/api/auth/demo-login', { role });
    localStorage.setItem('rentalhub_token', res.data.data.token);
    return res.data.data;
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<{ success: boolean; data: User }>('/api/auth/me');
    return res.data.data;
  },

  async getUserById(userId: string): Promise<User> {
    const res = await apiClient.get<{ success: boolean; data: User }>(`/api/auth/me/${userId}`);
    return res.data.data;
  },

  async toggleFavorite(equipmentId: string): Promise<string[]> {
    const res = await apiClient.post<{ success: boolean; data: { favorites: string[] } }>('/api/auth/favorite', {
      equipmentId,
    });
    return res.data.data.favorites;
  },

  async submitKyc(docUrl: string): Promise<User> {
    const res = await apiClient.post<{ success: boolean; data: User }>('/api/auth/kyc', {
      docUrl,
    });
    return res.data.data;
  },

  logout(): void {
    localStorage.removeItem('rentalhub_token');
  },
};
