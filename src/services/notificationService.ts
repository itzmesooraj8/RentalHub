import { apiClient } from './apiClient';
import { Notification } from '../types';

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    const res = await apiClient.get<{ success: boolean; data: Notification[] }>(`/api/notifications/${userId}`);
    return res.data.data;
  },
};
