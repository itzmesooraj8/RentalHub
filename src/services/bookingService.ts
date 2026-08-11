import { apiClient } from './apiClient';
import { Booking, BookingStatus, Dispute } from '../types';
import { MOCK_BOOKINGS } from '../data/mockData';

export const bookingService = {
  async getBookings(filter?: { customerId?: string; ownerId?: string; status?: BookingStatus }): Promise<Booking[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.customerId) params.append('customerId', filter.customerId);
      if (filter?.ownerId) params.append('ownerId', filter.ownerId);
      if (filter?.status) params.append('status', filter.status);

      const res = await apiClient.get<Booking[]>(`/api/bookings?${params.toString()}`);
      return res.data;
    } catch {
      let result = [...MOCK_BOOKINGS];
      if (filter?.customerId) result = result.filter((b) => b.customerId === filter.customerId);
      if (filter?.ownerId) result = result.filter((b) => b.ownerId === filter.ownerId);
      return result;
    }
  },

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const res = await apiClient.get<Booking>(`/api/bookings/${id}`);
      return res.data;
    } catch {
      return MOCK_BOOKINGS.find((b) => b.id === id || b.id.toLowerCase() === id.toLowerCase()) || null;
    }
  },

  async createBooking(data: {
    equipmentId: string;
    customerId: string;
    startDate: string;
    endDate: string;
    deliveryMethod?: 'pickup' | 'delivery';
    deliveryAddress?: string;
  }): Promise<Booking> {
    try {
      const res = await apiClient.post<Booking>('/api/bookings', data);
      return res.data;
    } catch {
      const newBooking: Booking = {
        id: `bk_${Date.now()}`,
        equipmentId: data.equipmentId,
        equipmentTitle: 'Reserved Machinery',
        equipmentImage: 'https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&q=80&w=1000',
        customerId: data.customerId,
        customerName: 'Sarah Jenkins',
        ownerId: 'usr_owner_1',
        ownerName: 'Marcus Vance',
        startDate: data.startDate,
        endDate: data.endDate,
        deliveryMethod: data.deliveryMethod || 'delivery',
        deliveryAddress: data.deliveryAddress || 'Job site depot',
        status: 'confirmed',
        priceBreakdown: {
          rentalDays: 3,
          dailyRate: 285,
          subtotal: 855,
          securityDeposit: 500,
          platformFee: 85.5,
          insuranceFee: 45.0,
          total: 1485.5,
        },
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      };
      return newBooking;
    }
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    try {
      const res = await apiClient.put<Booking>(`/api/bookings/${id}/status`, { status });
      return res.data;
    } catch {
      return null;
    }
  },

  async submitDamageReport(id: string, conditionData: any): Promise<Booking | null> {
    try {
      const res = await apiClient.post<Booking>(`/api/bookings/${id}/damage-track`, conditionData);
      return res.data;
    } catch {
      return null;
    }
  },
};
