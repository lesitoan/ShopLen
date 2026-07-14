"use client";

import React, { useState } from "react";
import { Bell, User, LogOut } from "lucide-react";
import Button from "@/components/ui/button";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Đơn hàng mới #DH2026",
      message: "Khách hàng Nguyễn Văn A vừa đặt đơn hàng trị giá 120.000đ.",
      time: "2 phút trước",
      unread: true,
    },
    {
      id: "2",
      title: "Thanh toán thành công #DH2025",
      message: "Đơn hàng #DH2025 đã khớp thanh toán tự động qua SePay.",
      time: "15 phút trước",
      unread: true,
    },
    {
      id: "3",
      title: "Sắp hết hàng",
      message: "Móc khóa Bé Heo Hồng chỉ còn 2 sản phẩm trong kho.",
      time: "1 giờ trước",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  return (
    <header className="bg-white border-b border-border h-16 px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left section: Title or Breadcrumbs info */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-text-secondary">Hệ thống quản trị</span>
        <span className="text-text-secondary/50">/</span>
        <span className="text-[13px] text-text-primary font-semibold">Dashboard</span>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-4 relative">
        {/* Notification Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            iconOnly
            onClick={handleNotificationClick}
            className="rounded-full text-text-secondary hover:bg-background relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-error w-4 h-4 rounded-full text-[9px] text-white flex items-center justify-center font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 border-b border-border flex items-center justify-between bg-background/50">
                <span className="font-semibold text-text-primary text-[13px]">Thông báo mới nhất</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-secondary hover:underline font-medium"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-left transition-colors cursor-pointer hover:bg-background/40 ${
                        n.unread ? "bg-primary-light/30" : ""
                      }`}
                    >
                      <p className="text-[12px] font-semibold text-text-primary">{n.title}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-text-secondary/60 mt-1 block">{n.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-text-secondary text-[12px]">Không có thông báo mới</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative">
          <button
            onClick={handleUserClick}
            className="flex items-center gap-2.5 outline-none hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-primary-light border border-primary/20 flex items-center justify-center text-secondary">
              <User size={18} />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[13px] font-semibold text-text-primary">Kiều Admin</span>
              <span className="text-[10px] text-text-secondary">Quản trị viên</span>
            </div>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2.5 w-44 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden py-1">
              <a
                href="/nhan-vien"
                className="flex items-center gap-2 px-3.5 py-2 text-[13px] text-text-primary hover:bg-background transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <User size={15} />
                <span>Hồ sơ cá nhân</span>
              </a>
              <hr className="border-border" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  alert("Đăng xuất hệ thống!");
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-[13px] text-error hover:bg-error/5 transition-colors text-left"
              >
                <LogOut size={15} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
