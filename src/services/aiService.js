import { apiClient } from "./apiClient";
export const aiService = {
  async smartSearch(query, userLocation, role) {
    const res = await apiClient.post("/api/ai/smart-search", {
      query,
      userLocation,
      role
    });
    return res.data.data;
  },
  async recommendPricing(equipmentId) {
    const res = await apiClient.post(
      "/api/ai/recommend-pricing",
      { equipmentId }
    );
    return res.data.data;
  }
};
