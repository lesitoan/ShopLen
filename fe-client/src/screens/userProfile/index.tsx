"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileSidebar from "./components/ProfileSidebar";
import PersonalInfoTab from "./components/PersonalInfoTab";
import OrderHistoryTab from "./components/OrderHistoryTab";
import AddressTab from "./components/AddressTab";
import ChangePasswordTab from "./components/ChangePasswordTab";
import MobileProfileView from "./components/MobileProfileView";
import { ProfileTab, UserProfile } from "./types";
import { MOCK_ORDERS, MOCK_ADDRESSES } from "./constants";
import { useGetMeQuery } from "@/services/api/authApi";
import { clearAuthTokens, hasAuthTokens } from "@/services/authStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthState, setCustomerProfile } from "@/store/slices/authSlice";
import UserProfileSkeleton from "@/components/skeletons/userProfile/UserProfileSkeleton";

export default function UserProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cachedCustomer = useAppSelector((state) => state.auth.customer);
  const shouldFetchProfile = hasAuthTokens();
  const { data: customer, isFetching, isError } = useGetMeQuery(undefined, {
    skip: !shouldFetchProfile,
  });
  const [activeTab, setActiveTab] = useState<ProfileTab>("PROFILE");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!shouldFetchProfile) {
      router.push("/dang-nhap");
    }
  }, [router, shouldFetchProfile]);

  useEffect(() => {
    if (customer) {
      dispatch(setCustomerProfile(customer));
    }
  }, [customer, dispatch]);

  useEffect(() => {
    if (isError) {
      clearAuthTokens();
      dispatch(clearAuthState());
      router.push("/dang-nhap");
    }
  }, [dispatch, isError, router]);

  const profileUser = useMemo<UserProfile | null>(() => {
    const profile = customer ?? cachedCustomer;

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone ?? "",
      gender:
        profile.gender === "MALE"
          ? "Nam"
          : profile.gender === "FEMALE"
            ? "Nữ"
            : "Khác",
      birthday: profile.birthday ?? "",
      avatar: profile.avatar || "/logo.png",
    };
  }, [cachedCustomer, customer]);

  const handleLogout = () => {
    clearAuthTokens();
    dispatch(clearAuthState());
    router.push("/");
  };

  if (!isMounted || isFetching || !profileUser) {
    return <UserProfileSkeleton />;
  }

  return (
    <main className="flex-1 py-8 text-left">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
        <div className="hidden md:grid grid-cols-12 gap-8 items-start">
          <div className="col-span-4 lg:col-span-3 sticky top-24">
            <ProfileSidebar
              user={profileUser}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />
          </div>

          <div className="col-span-8 lg:col-span-9">
            {activeTab === "PROFILE" && (
              <PersonalInfoTab user={profileUser} onUpdateSuccess={() => undefined} />
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
            user={profileUser}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          >
            {activeTab === "PROFILE" && (
              <PersonalInfoTab user={profileUser} onUpdateSuccess={() => undefined} />
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
