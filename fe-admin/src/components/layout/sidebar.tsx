"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  Users,
  Percent,
  Award,
  BookOpen,
  UserCheck,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Đơn hàng", path: "/don-hang", icon: <ShoppingBag size={18} />, badge: 3 },
    { name: "Sản phẩm", path: "/san-pham", icon: <Package size={18} /> },
    { name: "Danh mục", path: "/danh-muc", icon: <Tags size={18} /> },
    { name: "Khách hàng", path: "/khach-hang", icon: <Users size={18} /> },
    { name: "Khuyến mãi", path: "/khuyen-mai", icon: <Percent size={18} /> },
    { name: "Điểm thưởng", path: "/diem-thuong/cau-hinh", icon: <Award size={18} /> },
    { name: "Blog", path: "/blog", icon: <BookOpen size={18} /> },
    { name: "Nhân viên", path: "/nhan-vien", icon: <UserCheck size={18} /> },
    { name: "Thống kê", path: "/thong-ke", icon: <BarChart3 size={18} /> },
    { name: "Cấu hình", path: "/cau-hinh", icon: <Settings size={18} /> },
  ];

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`bg-white border-r border-border h-screen flex flex-col justify-between fixed left-0 top-0 transition-all duration-300 z-50 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div>
        {/* Logo and toggle */}
        <div className="flex items-center justify-between p-4 border-b border-border h-16">
          {!isCollapsed && (
            <span className="font-bold text-base text-secondary truncate">
              🌸 Nhà Kiều Admin
            </span>
          )}
          <button
            onClick={handleToggle}
            className={`text-text-secondary hover:text-text-primary rounded p-1 hover:bg-background transition-colors ${
              isCollapsed ? "mx-auto" : ""
            }`}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 relative ${
                  isActive
                    ? "bg-primary-light text-secondary font-bold"
                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                }`}
              >
                <div className="shrink-0">{item.icon}</div>
                {!isCollapsed && <span className="truncate">{item.name}</span>}

                {/* Optional Badge */}
                {item.badge !== undefined && (
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full w-4.5 h-4.5 text-[9px] font-bold flex items-center justify-center ${
                      isActive ? "bg-secondary text-white" : "bg-error text-white"
                    } ${isCollapsed ? "right-1.5 top-1.5 translate-y-0" : ""}`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border bg-background/50 text-[11px] text-text-secondary select-none text-center">
          v1.0.0 © Tiệm Len Nhà Kiều
        </div>
      )}
    </aside>
  );
}
