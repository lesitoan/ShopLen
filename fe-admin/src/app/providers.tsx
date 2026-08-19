"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { ToastContainer, type ToastPosition } from "react-toastify";
import { store } from "@/store";
import { useLazyGetMeQuery } from "@/services/api/adminAuthApi";
import { hasAuthTokens } from "@/services/authStorage";
import { setAdminProfile, setInitialized } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";

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
      />
    </Provider>
  );
}

function AppHydrator() {
  const dispatch = useAppDispatch();
  const [getMe] = useLazyGetMeQuery();

  useEffect(() => {
    if (!hasAuthTokens()) {
      dispatch(setInitialized(true));
      return;
    }

    getMe()
      .unwrap()
      .then((admin) => {
        dispatch(setAdminProfile(admin));
      })
      .catch(() => {
        dispatch(setInitialized(true));
      });
  }, [dispatch, getMe]);

  return null;
}
