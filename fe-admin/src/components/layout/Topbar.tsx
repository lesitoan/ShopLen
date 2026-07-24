"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Breadcrumb } from "../ui/Breadcrumb";
import { DropdownMenu } from "../ui/DropdownMenu";
import { Bell, User, LogOut, ShieldCheck, CheckCircle, ShoppingBag } from "lucide-react";
import { BREADCRUMB_ROUTE_MAP } from "./constants";

export interface TopbarProps {
  isCollapsed: boolean;
}

export default function Topbar({ isCollapsed }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(2);

  const getBreadcrumbItems = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [{ label: "Dashboard" }];

    return segments.map((seg, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = BREADCRUMB_ROUTE_MAP[seg] || seg;
      return { label, href };
    });
  };

  const notificationItems = [
    {
      key: "notif-1",
      label: "Đơn hàng mới #ORD-9821 vừa được khởi tạo",
      icon: <ShoppingBag className="w-4 h-4 text-primary shrink-0" />,
      onClick: () => setUnreadCount((prev) => Math.max(0, prev - 1)),
    },
    {
      key: "notif-2",
      label: "Thanh toán ngân hàng thành công cho #ORD-9818",
      icon: <CheckCircle className="w-4 h-4 text-status-success shrink-0" />,
      onClick: () => setUnreadCount((prev) => Math.max(0, prev - 1)),
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <User className="w-4 h-4 text-text-muted" />,
    },
    {
      key: "role",
      label: "Quyền Quản trị viên (Super Admin)",
      icon: <ShieldCheck className="w-4 h-4 text-primary" />,
      disabled: true,
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogOut className="w-4 h-4 text-status-danger" />,
      danger: true,
      onClick: () => {
        router.push("/login");
      },
    },
  ];

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-surface border-b border-border z-40 transition-all duration-300 flex items-center justify-between px-6 ${
        isCollapsed ? "left-16" : "left-64"
      }`}
    >
      <div className="flex items-center gap-4">
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>

      <div className="flex items-center gap-5">
        <DropdownMenu
          align="right"
          trigger={
            <div className="relative p-2.5 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-status-danger text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
          }
          items={notificationItems}
        />

        <div className="h-6 w-[1px] bg-border" />

        <DropdownMenu
          align="right"
          trigger={
            <div className="flex items-center gap-3 cursor-pointer px-3.5 py-2 rounded-lg hover:bg-surface-hover transition-colors select-none">
              <Image
                src="/images/avatar.svg"
                alt="Admin Kiều Avatar"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-primary/20"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-text-highlight leading-tight">
                  Admin Kiều
                </span>
                <span className="text-[10px] text-text-muted mt-0.5">Quản trị viên</span>
              </div>
            </div>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
}
