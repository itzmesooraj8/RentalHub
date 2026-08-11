import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Equipment } from '../types';

interface EquipmentState {
  items: Equipment[];
  selectedItem: Equipment | null;
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    search: string;
    minPrice: number;
    maxPrice: number;
    location: string;
    startDate: string;
    endDate: string;
    onlyAvailable: boolean;
    sort: string;
    mapView: boolean;
  };
}

const initialState: EquipmentState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  filters: {
    category: 'All',
    search: '',
    minPrice: 0,
    maxPrice: 1000,
    location: '',
    startDate: '',
    endDate: '',
    onlyAvailable: false,
    sort: 'newest',
    mapView: false
  }
};

export const fetchEquipment = createAsyncThunk(
  'equipment/fetchEquipment',
  async (filters?: Partial<EquipmentState['filters']> & { ownerId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice && filters.maxPrice < 1000) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.location) params.append('location', filters.location);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.onlyAvailable) params.append('onlyAvailable', 'true');
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.ownerId) params.append('ownerId', filters.ownerId);

    const res = await axios.get(`/api/equipment?${params.toString()}`);
    return res.data;
  }
);

export const fetchEquipmentById = createAsyncThunk(
  'equipment/fetchEquipmentById',
  async (id: string) => {
    const res = await axios.get(`/api/equipment/${id}`);
    return res.data;
  }
);

export const createEquipmentAsync = createAsyncThunk(
  'equipment/createEquipmentAsync',
  async (equipmentData: any) => {
    const res = await axios.post('/api/equipment', equipmentData);
    return res.data;
  }
);

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<EquipmentState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipment.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEquipmentById.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
      })
      .addCase(createEquipmentAsync.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  }
});

export const { setFilters, resetFilters } = equipmentSlice.actions;
export default equipmentSlice.reducer;
