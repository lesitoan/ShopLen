"use client";

import React, { useState, useEffect } from "react";
import ProfileSidebar from "./components/ProfileSidebar";
import PersonalInfoTab from "./components/PersonalInfoTab";
import OrderHistoryTab from "./components/OrderHistoryTab";
import AddressTab from "./components/AddressTab";
import ChangePasswordTab from "./components/ChangePasswordTab";
import MobileProfileView from "./components/MobileProfileView";
import { ProfileTab, UserProfile } from "./types";
import { DEMO_USER, MOCK_ORDERS, MOCK_ADDRESSES } from "./constants";
import { deleteCookie, checkIsLoggedIn } from "@/utils/cookieUtils";

export default function UserProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("PROFILE");
  const [user, setUser] = useState<UserProfile>(DEMO_USER);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check cookie on mount
    if (!checkIsLoggedIn()) {
      window.location.href = "/dang-nhap";
    }
  }, []);

  const handleLogout = () => {
    deleteCookie("isLogin");
    window.location.href = "/";
  };

  if (!isMounted) return null;

  return (
    <main className="flex-1 py-8 text-left">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
        <div className="hidden md:grid grid-cols-12 gap-8 items-start">
          <div className="col-span-4 lg:col-span-3 sticky top-24">
            <ProfileSidebar
              user={user}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />
          </div>

          <div className="col-span-8 lg:col-span-9">
            {activeTab === "PROFILE" && (
              <PersonalInfoTab user={user} onUpdateSuccess={setUser} />
            )}
            {activeTab === "ORDERS" && <OrderHistoryTab orders={MOCK_ORDERS} />}
            {activeTab === "ADDRESSES" && (
              <AddressTab addresses={MOCK_ADDRESSES} />
            )}
            {activeTab === "CHANGE_PASSWORD" && <ChangePasswordTab />}
          </div>
        </div>

        <div className="block md:hidden">
          <MobileProfileView
            user={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          >
            {activeTab === "PROFILE" && (
              <PersonalInfoTab user={user} onUpdateSuccess={setUser} />
            )}
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
