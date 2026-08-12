import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const INITIAL_DEMO_USER = {
  id: "usr_cust_1",
  name: "Ananya Iyer",
  email: "ananya.i@contracting.in",
  role: "customer",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
  phone: "+91 98110 54321",
  location: "New Delhi, NCR",
  bio: "Residential renovation general contractor and DIY enthusiast.",
  trustScore: 99,
  kycStatus: "verified",
  completedRentalsCount: 28,
  onTimeReturnRate: 100,
  createdAt: "2024-03-01T12:00:00Z",
  favorites: ["eq_2", "eq_5", "eq_8"]
};
const initialState = {
  user: INITIAL_DEMO_USER,
  token: "jwt_mock_token_usr_cust_1",
  loading: false,
  error: null
};
export const loginWithRole = createAsyncThunk(
  "auth/loginWithRole",
  async (role) => {
    const res = await axios.post("/api/auth/demo-login", { role });
    return res.data;
  }
);
export const submitKyc = createAsyncThunk(
  "auth/submitKyc",
  async ({ userId, docUrl }) => {
    const res = await axios.post("/api/auth/kyc", { userId, docUrl });
    return res.data.user;
  }
);
export const toggleFavoriteAsync = createAsyncThunk(
  "auth/toggleFavoriteAsync",
  async ({ userId, equipmentId }) => {
    const res = await axios.post("/api/auth/favorite", { userId, equipmentId });
    return res.data.favorites;
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginWithRole.pending, (state) => {
      state.loading = true;
    }).addCase(loginWithRole.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    }).addCase(submitKyc.fulfilled, (state, action) => {
      if (state.user) {
        state.user = action.payload;
      }
    }).addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
      if (state.user) {
        state.user.favorites = action.payload;
      }
    });
  }
});
export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
