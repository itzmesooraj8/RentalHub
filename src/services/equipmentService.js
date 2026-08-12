import { apiClient } from "./apiClient.js";
export const equipmentService = {
  async getEquipment(filters) {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== "All") params.append("category", filters.category);
    if (filters?.industry && filters.industry !== "All") params.append("industry", filters.industry);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.minPrice !== void 0) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== void 0) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.location) params.append("location", filters.location);
    if (filters?.lat !== void 0) params.append("lat", filters.lat.toString());
    if (filters?.lng !== void 0) params.append("lng", filters.lng.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.onlyAvailable) params.append("onlyAvailable", "true");
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.ownerId) params.append("ownerId", filters.ownerId);
    const res = await apiClient.get(`/api/equipment?${params.toString()}`);
    return res.data.data;
  },
  async getEquipmentNearby(lat, lng, radiusKm = 50) {
    const res = await apiClient.get(
      `/api/equipment/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`
    );
    return res.data.data;
  },
  async getEquipmentById(id) {
    const res = await apiClient.get(`/api/equipment/${id}`);
    return res.data.data;
  },
  async createEquipment(data) {
    const res = await apiClient.post("/api/equipment", data);
    return res.data.data;
  },
  async updateEquipment(id, updates) {
    const res = await apiClient.put(`/api/equipment/${id}`, updates);
    return res.data.data;
  },
  async deleteEquipment(id) {
    const res = await apiClient.delete(`/api/equipment/${id}`);
    return res.data.data.success;
  },
  async getAvailability(equipmentId, year, month) {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    const res = await apiClient.get(
      `/api/equipment/${equipmentId}/availability?${params.toString()}`
    );
    return res.data.data.blockedDates;
  }
};
