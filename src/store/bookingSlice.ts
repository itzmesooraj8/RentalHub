import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Booking, BookingStatus } from '../types';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null
};

export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (filter?: { customerId?: string; ownerId?: string }) => {
    const params = new URLSearchParams();
    if (filter?.customerId) params.append('customerId', filter.customerId);
    if (filter?.ownerId) params.append('ownerId', filter.ownerId);

    const res = await axios.get(`/api/bookings?${params.toString()}`);
    return res.data;
  }
);

export const createBookingAsync = createAsyncThunk(
  'booking/createBookingAsync',
  async (bookingData: { equipmentId: string; customerId: string; startDate: string; endDate: string }) => {
    const res = await axios.post('/api/bookings', bookingData);
    return res.data;
  }
);

export const updateBookingStatusAsync = createAsyncThunk(
  'booking/updateBookingStatusAsync',
  async ({ id, status }: { id: string; status: BookingStatus }) => {
    const res = await axios.put(`/api/bookings/${id}/status`, { status });
    return res.data;
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking(state, action: PayloadAction<Booking | null>) {
      state.currentBooking = action.payload;
    },
    clearBookingError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(createBookingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBookingAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create booking due to availability lock.';
      })
      .addCase(updateBookingStatusAsync.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index >= 0) {
          state.bookings[index] = action.payload;
        }
      });
  }
});

export const { setCurrentBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
