"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthTokens, hasAuthTokens } from "@/services/authStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthState } from "@/store/slices/authSlice";
import DesktopHeader from "./components/DesktopHeader";
import MobileHeader from "./components/MobileHeader";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.auth.customer);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isLoggedIn = isMounted && Boolean(customer || hasAuthTokens());

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close all modals and re-check login on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  const handleLogout = () => {
    clearAuthTokens();
    dispatch(clearAuthState());
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <div className="w-full flex flex-col sticky top-0 z-50 bg-surface">
      <header className="w-full relative">
        <DesktopHeader
          isLoggedIn={isLoggedIn}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleLogout={handleLogout}
          customer={customer}
        />

        <MobileHeader
          isLoggedIn={isLoggedIn}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          mobileMenuRef={mobileMenuRef}
          handleLogout={handleLogout}
          customer={customer}
        />
      </header>
    </div>
  );
}
