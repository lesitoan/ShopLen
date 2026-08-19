import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminSession } from "@/types/auth.type";

type AuthState = {
  admin: AdminSession | null;
  isInitialized: boolean;
};

const initialState: AuthState = {
  admin: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdminProfile(state, action: PayloadAction<AdminSession>) {
      state.admin = action.payload;
      state.isInitialized = true;
    },
    clearAuthState(state) {
      state.admin = null;
      state.isInitialized = true;
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
  },
});

export const { clearAuthState, setAdminProfile, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
