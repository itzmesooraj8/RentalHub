import { apiClient } from './apiClient';
import { OwnerAnalytics, AdminAnalytics } from '../types';

export const analyticsService = {
  async getOwnerAnalytics(ownerId: string): Promise<OwnerAnalytics> {
    const res = await apiClient.get<{ success: boolean; data: OwnerAnalytics }>(`/api/analytics/owner/${ownerId}`);
    return res.data.data;
  },

  async getAdminAnalytics(): Promise<AdminAnalytics> {
    const res = await apiClient.get<{ success: boolean; data: AdminAnalytics }>('/api/analytics/admin');
    return res.data.data;
  },
};
