import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/services/api/baseApi";
import authReducer from "@/store/slices/authSlice";
import cartReducer from "@/store/slices/cartSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
