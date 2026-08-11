import { apiClient } from './apiClient';
import { Booking, BookingStatus } from '../types';

export const bookingService = {
  async getBookings(filter?: { customerId?: string; ownerId?: string; status?: BookingStatus }): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (filter?.customerId) params.append('customerId', filter.customerId);
    if (filter?.ownerId) params.append('ownerId', filter.ownerId);
    if (filter?.status) params.append('status', filter.status);

    const res = await apiClient.get<{ success: boolean; data: Booking[] }>(`/api/bookings?${params.toString()}`);
    return res.data.data;
  },

  async getBookingById(id: string): Promise<Booking> {
    const res = await apiClient.get<{ success: boolean; data: Booking }>(`/api/bookings/${id}`);
    return res.data.data;
  },

  async createBooking(data: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    deliveryMethod?: 'pickup' | 'delivery';
    deliveryAddress?: string;
  }): Promise<Booking> {
    const res = await apiClient.post<{ success: boolean; data: Booking }>('/api/bookings', data);
    return res.data.data;
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const res = await apiClient.patch<{ success: boolean; data: Booking }>(`/api/bookings/${id}/status`, { status });
    return res.data.data;
  },
};
