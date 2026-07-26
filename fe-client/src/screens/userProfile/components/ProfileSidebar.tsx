"use client";

import React from "react";
import { User, ShoppingBag, MapPin, KeyRound, LogOut } from "lucide-react";
import UserAvatarHeader from "./UserAvatarHeader";
import { ProfileTab } from "../types";

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
}

export default function ProfileSidebar({
  activeTab,
  onTabChange,
  onLogout,
}: ProfileSidebarProps) {

  const menuItems: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "PROFILE", label: "Thông tin cá nhân", icon: <User size={18} /> },
    { id: "ORDERS", label: "Đơn hàng của tôi", icon: <ShoppingBag size={18} /> },
    { id: "ADDRESSES", label: "Sổ địa chỉ", icon: <MapPin size={18} /> },
    { id: "CHANGE_PASSWORD", label: "Đổi mật khẩu", icon: <KeyRound size={18} /> },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-6">
      <div className="pb-5 border-b border-border/60">
        <UserAvatarHeader />
      </div>

      <nav className="flex flex-col gap-1.5 text-left">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13.5px] font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary-light text-secondary border border-primary/20"
                  : "text-text-primary hover:bg-background hover:text-secondary"
              }`}
            >
              <span className={isActive ? "text-secondary" : "text-text-secondary"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[13.5px] font-semibold text-error hover:bg-error/10 transition-all duration-200 mt-2"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
}
