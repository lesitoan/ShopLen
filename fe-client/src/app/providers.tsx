"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ToastContainer, type ToastPosition } from "react-toastify";
import { useLazyGetMeQuery } from "@/services/api/authApi";
import { hasAuthTokens } from "@/services/authStorage";
import { setCustomerProfile } from "@/store/slices/authSlice";
import { hydrateCart } from "@/store/slices/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import { store } from "@/store";
import type { ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  const [toastPosition, setToastPosition] =
    useState<ToastPosition>("top-right");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncToastPosition = () => {
      setToastPosition(mediaQuery.matches ? "top-center" : "top-right");
    };

    syncToastPosition();
    mediaQuery.addEventListener("change", syncToastPosition);

    return () => {
      mediaQuery.removeEventListener("change", syncToastPosition);
    };
  }, []);

  return (
    <Provider store={store}>
      <AppHydrator />
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
      >
        {children}
        <ToastContainer
          position={toastPosition}
          autoClose={2600}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="light"
        />
      </GoogleOAuthProvider>
    </Provider>
  );
}

function AppHydrator() {
  const dispatch = useAppDispatch();
  const [getMe] = useLazyGetMeQuery();

  useEffect(() => {
    dispatch(hydrateCart());

    if (!hasAuthTokens()) {
      return;
    }

    getMe()
      .unwrap()
      .then((customer) => {
        dispatch(setCustomerProfile(customer));
      })
      .catch(() => undefined);
  }, [dispatch, getMe]);

  return null;
}
