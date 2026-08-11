import { apiClient } from './apiClient';
import { User, UserRole } from '../types';
import { CURRENT_USER } from '../data/mockData';

export const authService = {
  async loginWithRole(role: UserRole): Promise<{ user: User; token: string }> {
    try {
      const res = await apiClient.post<{ user: User; token: string }>('/api/auth/demo-login', { role });
      return res.data;
    } catch {
      return {
        user: { ...CURRENT_USER, role },
        token: `mock_jwt_token_${role}`,
      };
    }
  },

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const res = await apiClient.get<User>(`/api/auth/me/${userId}`);
      return res.data;
    } catch {
      return CURRENT_USER;
    }
  },

  async toggleFavorite(userId: string, equipmentId: string): Promise<string[]> {
    try {
      const res = await apiClient.post<{ success: boolean; favorites: string[] }>('/api/auth/favorite', {
        userId,
        equipmentId,
      });
      return res.data.favorites;
    } catch {
      return [equipmentId];
    }
  },

  async submitKyc(userId: string, docUrl: string): Promise<User | null> {
    try {
      const res = await apiClient.post<{ success: boolean; user: User }>('/api/auth/kyc', {
        userId,
        docUrl,
      });
      return res.data.user;
    } catch {
      return { ...CURRENT_USER, kycStatus: 'verified', kycVerified: true };
    }
  },
};
