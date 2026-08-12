import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import equipmentReducer from "./equipmentSlice.js";
import bookingReducer from "./bookingSlice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
    booking: bookingReducer
  }
});
