import { apiClient } from './apiClient';
import { Equipment, DynamicPricingSuggestion } from '../types';

export interface SmartSearchResult {
  query: string;
  aiInterpretation: string;
  resultsCount: number;
  equipment: Equipment[];
}

export const aiService = {
  async smartSearch(
    query: string,
    userLocation?: { lat: number; lng: number },
    role?: string
  ): Promise<SmartSearchResult> {
    const res = await apiClient.post<{ success: boolean; data: SmartSearchResult }>('/api/ai/smart-search', {
      query,
      userLocation,
      role,
    });
    return res.data.data;
  },

  async recommendPricing(equipmentId: string): Promise<DynamicPricingSuggestion | { available: false; message: string }> {
    const res = await apiClient.post<{ success: boolean; data: DynamicPricingSuggestion | { available: false; message: string } }>(
      '/api/ai/recommend-pricing',
      { equipmentId }
    );
    return res.data.data;
  },
};
