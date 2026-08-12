import { apiClient } from "./apiClient.js";
export const notificationService = {
  async getNotifications(userId) {
    const res = await apiClient.get(`/api/notifications/${userId}`);
    return res.data.data;
  }
};
