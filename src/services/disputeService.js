import { apiClient } from "./apiClient";
export const disputeService = {
  async getDisputes() {
    const res = await apiClient.get("/api/disputes");
    return res.data.data;
  },
  async resolveDispute(id, winner) {
    const res = await apiClient.post(`/api/disputes/${id}/resolve`, { winner });
    return res.data.data;
  }
};
