"use client";

import React from "react";
import Image from "next/image";
import { User, ShoppingBag, MapPin, KeyRound, LogOut, ChevronRight, ArrowLeft } from "lucide-react";
import { UserProfile, ProfileTab } from "../types";

interface MobileProfileViewProps {
  user: UserProfile;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function MobileProfileView({
  user,
  activeTab,
  onTabChange,
  onLogout,
  children,
}: MobileProfileViewProps) {
  const [selectedMobileTab, setSelectedMobileTab] = React.useState<ProfileTab | null>(null);

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
          <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 bg-background shrink-0">
              <Image
                src={user.avatar}
                alt={user.fullName}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[15px] font-bold text-text-primary truncate">
                {user.fullName}
              </span>
              <span className="text-[12px] text-text-secondary truncate mt-0.5">
                {user.phone} • {user.email}
              </span>
            </div>
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
