import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  filters: {
    category: "All",
    search: "",
    minPrice: 0,
    maxPrice: 1e3,
    location: "",
    startDate: "",
    endDate: "",
    onlyAvailable: false,
    sort: "newest",
    mapView: false
  }
};
export const fetchEquipment = createAsyncThunk(
  "equipment/fetchEquipment",
  async (filters) => {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== "All") params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice && filters.maxPrice < 1e3) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.location) params.append("location", filters.location);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.onlyAvailable) params.append("onlyAvailable", "true");
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.ownerId) params.append("ownerId", filters.ownerId);
    const res = await axios.get(`/api/equipment?${params.toString()}`);
    return res.data;
  }
);
export const fetchEquipmentById = createAsyncThunk(
  "equipment/fetchEquipmentById",
  async (id) => {
    const res = await axios.get(`/api/equipment/${id}`);
    return res.data;
  }
);
export const createEquipmentAsync = createAsyncThunk(
  "equipment/createEquipmentAsync",
  async (equipmentData) => {
    const res = await axios.post("/api/equipment", equipmentData);
    return res.data;
  }
);
const equipmentSlice = createSlice({
  name: "equipment",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEquipment.pending, (state) => {
      state.loading = true;
    }).addCase(fetchEquipment.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    }).addCase(fetchEquipmentById.fulfilled, (state, action) => {
      state.selectedItem = action.payload;
    }).addCase(createEquipmentAsync.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });
  }
});
export const { setFilters, resetFilters } = equipmentSlice.actions;
export default equipmentSlice.reducer;
