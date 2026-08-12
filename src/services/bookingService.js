import { apiClient } from "./apiClient";
export const bookingService = {
  async getBookings(filter) {
    const params = new URLSearchParams();
    if (filter?.customerId) params.append("customerId", filter.customerId);
    if (filter?.ownerId) params.append("ownerId", filter.ownerId);
    if (filter?.status) params.append("status", filter.status);
    const res = await apiClient.get(`/api/bookings?${params.toString()}`);
    return res.data.data;
  },
  async getBookingById(id) {
    const res = await apiClient.get(`/api/bookings/${id}`);
    return res.data.data;
  },
  async createBooking(data) {
    const res = await apiClient.post("/api/bookings", data);
    return res.data.data;
  },
  async updateBookingStatus(id, status) {
    const res = await apiClient.patch(`/api/bookings/${id}/status`, { status });
    return res.data.data;
  }
};
