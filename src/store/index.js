import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import equipmentReducer from "./equipmentSlice";
import bookingReducer from "./bookingSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
    booking: bookingReducer
  }
});
