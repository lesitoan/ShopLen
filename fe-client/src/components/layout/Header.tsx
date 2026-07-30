"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthTokens, hasAuthTokens } from "@/services/authStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthState } from "@/store/slices/authSlice";
import { baseApi } from "@/services/api/baseApi";
import DesktopHeader from "./components/DesktopHeader";
import MobileHeader from "./components/MobileHeader";
import Modal from "@/components/ui/Modal";
import useModal from "@/hooks/useModal";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.auth.customer);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isLoggedIn = isMounted && Boolean(customer || hasAuthTokens());

  const {
    isOpen: isLogoutModalOpen,
    openModal: openLogoutModal,
    closeModal: closeLogoutModal,
  } = useModal();

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

  const handleConfirmLogout = () => {
    clearAuthTokens();
    dispatch(clearAuthState());
    dispatch(baseApi.util.resetApiState());
    setIsMobileMenuOpen(false);
    closeLogoutModal();
    router.push("/");
  };

  return (
    <div className="w-full flex flex-col sticky top-0 z-50 bg-surface">
      <header className="w-full relative">
        <DesktopHeader
          isLoggedIn={isLoggedIn}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleLogout={openLogoutModal}
          customer={customer}
        />

        <MobileHeader
          isLoggedIn={isLoggedIn}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          mobileMenuRef={mobileMenuRef}
          handleLogout={openLogoutModal}
          customer={customer}
        />
      </header>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        title="Xác nhận đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?"
        onConfirm={handleConfirmLogout}
        confirmLabel="Đăng xuất"
        cancelLabel="Hủy"
        isDestructive={true}
      />
    </div>
  );
}
