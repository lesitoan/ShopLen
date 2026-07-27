"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileSidebar from "./components/ProfileSidebar";
import PersonalInfoTab from "./components/PersonalInfoTab";
import OrderHistoryTab from "./components/OrderHistoryTab";
import AddressTab from "./components/addressTab/AddressTab";
import ChangePasswordTab from "./components/ChangePasswordTab";
import MobileProfileView from "./components/MobileProfileView";
import Modal from "@/components/ui/Modal";
import useModal from "@/hooks/useModal";
import { ProfileTab } from "./types";
import { MOCK_ORDERS, TAB_SLUG_MAP, SLUG_TO_TAB_MAP } from "./constants";
import { clearAuthTokens, hasAuthTokens } from "@/services/authStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthState } from "@/store/slices/authSlice";
import UserProfileSkeleton from "@/components/skeletons/userProfile/UserProfileSkeleton";

export default function UserProfileScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.auth.customer);
  const isAuthenticated = hasAuthTokens();

  const {
    isOpen: isLogoutModalOpen,
    openModal: openLogoutModal,
    closeModal: closeLogoutModal,
  } = useModal();

  const tabParam = searchParams.get("tab");
  const initialTab: ProfileTab =
    tabParam && SLUG_TO_TAB_MAP[tabParam]
      ? SLUG_TO_TAB_MAP[tabParam]
      : "PROFILE";

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push("/dang-nhap");
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    if (tabParam && SLUG_TO_TAB_MAP[tabParam]) {
      setActiveTab(SLUG_TO_TAB_MAP[tabParam]);
    } else if (!tabParam) {
      setActiveTab("PROFILE");
    }
  }, [tabParam]);

  const handleTabChange = (newTab: ProfileTab) => {
    setActiveTab(newTab);
    const slug = TAB_SLUG_MAP[newTab];
    if (slug) {
      router.push(`/tai-khoan?tab=${slug}`, { scroll: false });
    }
  };

  const handleConfirmLogout = () => {
    clearAuthTokens();
    dispatch(clearAuthState());
    closeLogoutModal();
    router.push("/");
  };

  if (!isMounted || !customer) {
    return <UserProfileSkeleton />;
  }

  return (
    <main className="flex-1 py-8 text-left">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
        <div className="hidden md:grid grid-cols-12 gap-8 items-start">
          <div className="col-span-4 lg:col-span-3 sticky top-24">
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onLogout={openLogoutModal}
            />
          </div>

          <div className="col-span-8 lg:col-span-9">
            {activeTab === "PROFILE" && <PersonalInfoTab />}
            {activeTab === "ORDERS" && <OrderHistoryTab orders={MOCK_ORDERS} />}
            {activeTab === "ADDRESSES" && <AddressTab />}
            {activeTab === "CHANGE_PASSWORD" && <ChangePasswordTab />}
          </div>
        </div>

        <div className="block md:hidden">
          <MobileProfileView
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onBackToMenu={() => router.push("/tai-khoan", { scroll: false })}
            onLogout={openLogoutModal}
          >
            {activeTab === "PROFILE" && <PersonalInfoTab />}
            {activeTab === "ORDERS" && <OrderHistoryTab orders={MOCK_ORDERS} />}
            {activeTab === "ADDRESSES" && <AddressTab />}
            {activeTab === "CHANGE_PASSWORD" && <ChangePasswordTab />}
          </MobileProfileView>
        </div>
      </div>

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
    </main>
  );
}
