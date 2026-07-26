"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileSidebar from "./components/ProfileSidebar";
import PersonalInfoTab from "./components/PersonalInfoTab";
import OrderHistoryTab from "./components/OrderHistoryTab";
import AddressTab from "./components/AddressTab";
import ChangePasswordTab from "./components/ChangePasswordTab";
import MobileProfileView from "./components/MobileProfileView";
import { ProfileTab } from "./types";
import { MOCK_ORDERS, MOCK_ADDRESSES } from "./constants";
import { clearAuthTokens, hasAuthTokens } from "@/services/authStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthState } from "@/store/slices/authSlice";
import UserProfileSkeleton from "@/components/skeletons/userProfile/UserProfileSkeleton";

export default function UserProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.auth.customer);
  const isAuthenticated = hasAuthTokens();
  const [activeTab, setActiveTab] = useState<ProfileTab>("PROFILE");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push("/dang-nhap");
    }
  }, [router, isAuthenticated]);

  const handleLogout = () => {
    clearAuthTokens();
    dispatch(clearAuthState());
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
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />
          </div>

          <div className="col-span-8 lg:col-span-9">
            {activeTab === "PROFILE" && <PersonalInfoTab />}
            {activeTab === "ORDERS" && <OrderHistoryTab orders={MOCK_ORDERS} />}
            {activeTab === "ADDRESSES" && (
              <AddressTab addresses={MOCK_ADDRESSES} />
            )}
            {activeTab === "CHANGE_PASSWORD" && <ChangePasswordTab />}
          </div>
        </div>

        <div className="block md:hidden">
          <MobileProfileView
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          >
            {activeTab === "PROFILE" && <PersonalInfoTab />}
            {activeTab === "ORDERS" && <OrderHistoryTab orders={MOCK_ORDERS} />}
            {activeTab === "ADDRESSES" && (
              <AddressTab addresses={MOCK_ADDRESSES} />
            )}
            {activeTab === "CHANGE_PASSWORD" && <ChangePasswordTab />}
          </MobileProfileView>
        </div>
      </div>
    </main>
  );
}
