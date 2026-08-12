import { apiClient } from "./apiClient";
export const analyticsService = {
  async getOwnerAnalytics(ownerId) {
    const res = await apiClient.get(`/api/analytics/owner/${ownerId}`);
    return res.data.data;
  },
  async getAdminAnalytics() {
    const res = await apiClient.get("/api/analytics/admin");
    return res.data.data;
  }
};
