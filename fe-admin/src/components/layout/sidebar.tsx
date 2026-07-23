"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Users,
  Percent,
  Award,
  FileText,
  UserCheck,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";

export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Đơn hàng", path: "/orders", icon: <ShoppingBag size={18} />, badge: 3 },
    { name: "Sản phẩm", path: "/products", icon: <Package size={18} /> },
    { name: "Danh mục", path: "/categories", icon: <FolderTree size={18} /> },
    { name: "Khách hàng", path: "/customers", icon: <Users size={18} /> },
    { name: "Khuyến mãi", path: "/promotions", icon: <Percent size={18} /> },
    { name: "Điểm thưởng", path: "/rewards/config", icon: <Award size={18} /> },
    { name: "Bài viết", path: "/blog", icon: <FileText size={18} /> },
    { name: "Nhân viên", path: "/staff", icon: <UserCheck size={18} /> },
    { name: "Thống kê", path: "/analytics", icon: <BarChart3 size={18} /> },
    { name: "Cấu hình", path: "/settings", icon: <Settings size={18} /> },
  ];

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`bg-surface border-r border-border h-screen flex flex-col justify-between fixed left-0 top-0 transition-all duration-300 z-50 shadow-2xl shadow-black/40 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div>
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <Store size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-text-highlight truncate tracking-tight">
                  Tiệm Len Nhà Kiều
                </span>
                <span className="text-[10px] text-primary font-medium tracking-wider uppercase">
                  Admin Dashboard
                </span>
              </div>
            </Link>
          )}

          {isCollapsed && (
            <div className="mx-auto w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Store size={18} />
            </div>
          )}

          <button
            onClick={handleToggle}
            className={`text-text-muted hover:text-text-primary rounded-md p-1.5 hover:bg-surface-hover transition-colors ${
              isCollapsed ? "mx-auto mt-2" : ""
            }`}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="p-2.5 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 relative group ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-emerald-600 text-bg-deep font-bold shadow-md shadow-primary/20"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }`}
              >
                <div
                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-bg-deep" : "text-text-muted group-hover:text-text-primary"
                  }`}
                >
                  {item.icon}
                </div>

                {!isCollapsed && <span className="truncate">{item.name}</span>}

                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold shrink-0 ${
                      isActive
                        ? "bg-bg-deep text-primary font-extrabold"
                        : "bg-status-danger/20 text-status-danger border border-status-danger/30"
                    } ${
                      isCollapsed
                        ? "absolute right-1 top-1 text-[9px] px-1 py-0"
                        : "ml-auto"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {!isCollapsed && (
        <div className="p-3 border-t border-border bg-surface-muted/30 text-[11px] text-text-muted select-none text-center">
          v1.0.0 Admin Control Center
        </div>
      )}
    </aside>
  );
}
