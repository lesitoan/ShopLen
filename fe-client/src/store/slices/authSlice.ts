import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CustomerSession } from "@/types/auth.type";

type AuthState = {
  customer: CustomerSession | null;
};

const initialState: AuthState = {
  customer: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCustomerProfile(state, action: PayloadAction<CustomerSession>) {
      state.customer = action.payload;
    },
    clearAuthState(state) {
      state.customer = null;
    },
  },
});

export const { clearAuthState, setCustomerProfile } = authSlice.actions;
export default authSlice.reducer;
