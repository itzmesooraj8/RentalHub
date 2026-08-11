import { apiClient } from './apiClient';
import { Equipment } from '../types';

export interface EquipmentFilterParams {
  category?: string;
  industry?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  startDate?: string;
  endDate?: string;
  onlyAvailable?: boolean;
  sort?: string;
  ownerId?: string;
}

export const equipmentService = {
  async getEquipment(filters?: EquipmentFilterParams): Promise<Equipment[]> {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.industry && filters.industry !== 'All') params.append('industry', filters.industry);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.location) params.append('location', filters.location);
    if (filters?.lat !== undefined) params.append('lat', filters.lat.toString());
    if (filters?.lng !== undefined) params.append('lng', filters.lng.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.onlyAvailable) params.append('onlyAvailable', 'true');
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.ownerId) params.append('ownerId', filters.ownerId);

    const res = await apiClient.get<{ success: boolean; data: Equipment[] }>(`/api/equipment?${params.toString()}`);
    return res.data.data;
  },

  async getEquipmentNearby(lat: number, lng: number, radiusKm: number = 50): Promise<Equipment[]> {
    const res = await apiClient.get<{ success: boolean; data: Equipment[] }>(
      `/api/equipment/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`
    );
    return res.data.data;
  },

  async getEquipmentById(id: string): Promise<Equipment> {
    const res = await apiClient.get<{ success: boolean; data: Equipment }>(`/api/equipment/${id}`);
    return res.data.data;
  },

  async createEquipment(data: Partial<Equipment>): Promise<Equipment> {
    const res = await apiClient.post<{ success: boolean; data: Equipment }>('/api/equipment', data);
    return res.data.data;
  },

  async updateEquipment(id: string, updates: Partial<Equipment>): Promise<Equipment> {
    const res = await apiClient.put<{ success: boolean; data: Equipment }>(`/api/equipment/${id}`, updates);
    return res.data.data;
  },

  async deleteEquipment(id: string): Promise<boolean> {
    const res = await apiClient.delete<{ success: boolean; data: { success: boolean } }>(`/api/equipment/${id}`);
    return res.data.data.success;
  },

  async getAvailability(equipmentId: string, year?: number, month?: number): Promise<string[]> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    const res = await apiClient.get<{ success: boolean; data: { blockedDates: string[] } }>(
      `/api/equipment/${equipmentId}/availability?${params.toString()}`
    );
    return res.data.data.blockedDates;
  },
};
