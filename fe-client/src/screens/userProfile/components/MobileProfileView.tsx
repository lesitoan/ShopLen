"use client";

import React, { useState } from "react";
import { User, ShoppingBag, MapPin, KeyRound, LogOut, ChevronRight, ArrowLeft } from "lucide-react";
import UserAvatarHeader from "./UserAvatarHeader";
import { useAppSelector } from "@/store/hooks";
import type { CustomerSession } from "@/types/auth.type";
import { ProfileTab } from "../types";

interface MobileProfileViewProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function MobileProfileView({
  activeTab,
  onTabChange,
  onLogout,
  children,
}: MobileProfileViewProps) {
  const activeUser = useAppSelector((state) => state.auth.customer);
  const [selectedMobileTab, setSelectedMobileTab] = useState<ProfileTab | null>(null);

  const menuList: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "PROFILE", label: "Thông tin cá nhân", icon: <User size={18} /> },
    { id: "ORDERS", label: "Đơn hàng của tôi", icon: <ShoppingBag size={18} /> },
    { id: "ADDRESSES", label: "Sổ địa chỉ", icon: <MapPin size={18} /> },
    { id: "CHANGE_PASSWORD", label: "Đổi mật khẩu", icon: <KeyRound size={18} /> },
  ];

  const handleSelectTab = (tabId: ProfileTab) => {
    onTabChange(tabId);
    setSelectedMobileTab(tabId);
  };

  const mobileSubtitle = activeUser
    ? `${activeUser.phone ?? ""}${activeUser.phone && activeUser.email ? " • " : ""}${activeUser.email}`
    : "";

  return (
    <div className="flex flex-col gap-5 w-full text-left md:hidden">
      {selectedMobileTab ? (
        <div className="flex items-center gap-3 pb-2 border-b border-border/60">
          <button
            type="button"
            onClick={() => setSelectedMobileTab(null)}
            className="p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-[16px] font-bold text-text-primary">
            {menuList.find((m) => m.id === selectedMobileTab)?.label}
          </span>
        </div>
      ) : (
        <>
          <div className="bg-surface border border-border rounded-xl p-4">
            <UserAvatarHeader
              subtitle={mobileSubtitle}
              avatarSizeClass="w-14 h-14"
              avatarImageSize="56px"
            />
          </div>

          <div className="bg-surface border border-border rounded-xl p-2 flex flex-col gap-1">
            {menuList.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className="flex items-center justify-between p-3.5 rounded-lg hover:bg-background transition-colors text-[14px] font-semibold text-text-primary"
              >
                <div className="flex items-center gap-3">
                  <span className="text-secondary p-1.5 bg-primary-light/60 rounded-lg">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-text-secondary/60" />
              </button>
            ))}

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-between p-3.5 rounded-lg hover:bg-error/10 transition-colors text-[14px] font-semibold text-error mt-1"
            >
              <div className="flex items-center gap-3">
                <span className="text-error p-1.5 bg-error/10 rounded-lg">
                  <LogOut size={18} />
                </span>
                <span>Đăng xuất</span>
              </div>
              <ChevronRight size={16} className="text-error/60" />
            </button>
          </div>
        </>
      )}

      {selectedMobileTab && <div className="w-full">{children}</div>}
    </div>
  );
}
