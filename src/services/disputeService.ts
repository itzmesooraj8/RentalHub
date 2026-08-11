import { apiClient } from './apiClient';
import { Dispute } from '../types';

export const disputeService = {
  async getDisputes(): Promise<Dispute[]> {
    const res = await apiClient.get<{ success: boolean; data: Dispute[] }>('/api/disputes');
    return res.data.data;
  },

  async resolveDispute(id: string, winner: 'renter' | 'owner'): Promise<Dispute> {
    const res = await apiClient.post<{ success: boolean; data: Dispute }>(`/api/disputes/${id}/resolve`, { winner });
    return res.data.data;
  },
};
