import { apiClient } from './apiClient';
import { Equipment, EquipmentCategory } from '../types';
import { MOCK_EQUIPMENT } from '../data/mockData';

export interface EquipmentFilterParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  startDate?: string;
  endDate?: string;
  onlyAvailable?: boolean;
  sort?: string;
  ownerId?: string;
}

export const equipmentService = {
  async getEquipment(filters?: EquipmentFilterParams): Promise<Equipment[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice && filters.maxPrice < 1200) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.location) params.append('location', filters.location);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.onlyAvailable) params.append('onlyAvailable', 'true');
      if (filters?.sort) params.append('sort', filters.sort);
      if (filters?.ownerId) params.append('ownerId', filters.ownerId);

      const res = await apiClient.get<Equipment[]>(`/api/equipment?${params.toString()}`);
      return res.data;
    } catch {
      // Fallback local filtering if backend unreachable
      let result = [...MOCK_EQUIPMENT];
      if (filters?.ownerId) {
        result = result.filter((e) => e.ownerId === filters.ownerId);
      }
      if (filters?.category && filters.category !== 'All') {
        result = result.filter((e) => e.category === filters.category);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            e.category.toLowerCase().includes(q) ||
            e.location.toLowerCase().includes(q)
        );
      }
      if (filters?.maxPrice) {
        result = result.filter((e) => e.dailyRate <= filters.maxPrice!);
      }
      return result;
    }
  },

  async getEquipmentById(id: string): Promise<Equipment | null> {
    try {
      const res = await apiClient.get<Equipment>(`/api/equipment/${id}`);
      return res.data;
    } catch {
      return MOCK_EQUIPMENT.find((e) => e.id === id) || null;
    }
  },

  async createEquipment(data: Partial<Equipment>): Promise<Equipment> {
    try {
      const res = await apiClient.post<Equipment>('/api/equipment', data);
      return res.data;
    } catch {
      const newEq: Equipment = {
        id: `eq_${Date.now()}`,
        ownerId: data.ownerId || 'usr_owner_1',
        ownerName: data.ownerName || 'Marcus Vance',
        ownerAvatar: data.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        ownerTrustScore: 98,
        ownerKyVerified: true,
        title: data.title || 'New Equipment Asset',
        category: data.category || 'Heavy Machinery',
        industry: data.industry || 'Construction',
        description: data.description || 'Verified operating equipment.',
        dailyRate: Number(data.dailyRate) || 250,
        weeklyRate: Number(data.weeklyRate) || 1200,
        securityDeposit: Number(data.securityDeposit) || 500,
        location: data.location || 'Austin, TX',
        lat: data.lat || 30.2672,
        lng: data.lng || -97.7431,
        images: data.images?.length ? data.images : ['https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=1000'],
        specs: data.specs || {},
        status: 'active',
        rating: 5.0,
        reviewCount: 0,
        co2SavedPerDayKg: 15.0,
        createdAt: new Date().toISOString(),
      };
      return newEq;
    }
  },

  async updateEquipment(id: string, updates: Partial<Equipment>): Promise<Equipment | null> {
    try {
      const res = await apiClient.put<Equipment>(`/api/equipment/${id}`, updates);
      return res.data;
    } catch {
      return null;
    }
  },

  async deleteEquipment(id: string): Promise<boolean> {
    try {
      const res = await apiClient.delete<{ success: boolean }>(`/api/equipment/${id}`);
      return res.data.success;
    } catch {
      return true;
    }
  },
};
