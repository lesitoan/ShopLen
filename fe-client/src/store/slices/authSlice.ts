import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CustomerSession } from "@/types/auth.type";

type AuthState = {
  customer: CustomerSession | null;
  isInitialized: boolean;
};

const initialState: AuthState = {
  customer: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCustomerProfile(state, action: PayloadAction<CustomerSession>) {
      state.customer = action.payload;
      state.isInitialized = true;
    },
    clearAuthState(state) {
      state.customer = null;
      state.isInitialized = true;
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
  },
});

export const { clearAuthState, setCustomerProfile, setInitialized } = authSlice.actions;
export default authSlice.reducer;
