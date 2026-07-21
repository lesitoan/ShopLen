"use client";

import React from "react";
import Image from "next/image";
import { User, ShoppingBag, MapPin, KeyRound, LogOut } from "lucide-react";
import { UserProfile, ProfileTab } from "../types";

interface ProfileSidebarProps {
  user: UserProfile;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
}

export default function ProfileSidebar({
  user,
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
      <div className="flex items-center gap-3.5 pb-5 border-b border-border/60">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-background shrink-0">
          <Image
            src={user.avatar}
            alt={user.fullName}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0 text-left">
          <span className="text-[14.5px] font-bold text-text-primary truncate">
            {user.fullName}
          </span>
          <span className="text-[12px] text-text-secondary truncate mt-0.5">
            {user.phone}
          </span>
        </div>
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
