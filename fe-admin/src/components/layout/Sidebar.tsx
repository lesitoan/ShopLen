"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_MENU_ITEMS } from "./constants";
import { usePermission } from "@/hooks/usePermission";

export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { hasPermission } = usePermission();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const visibleMenuItems = NAV_MENU_ITEMS.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <aside
      className={`bg-surface border-r border-border h-screen flex flex-col justify-between fixed left-0 top-0 transition-all duration-300 z-50 shadow-2xl shadow-black/40 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div>
        <div
          className={`flex items-center h-16 border-b border-border ${
            isCollapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          {!isCollapsed && (
            <Link
              href="/"
              className="flex items-center gap-2.5 overflow-hidden"
              title="Tiệm Len Nhà Kiều"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-primary/30 flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Tiệm Len Nhà Kiều Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-text-highlight truncate tracking-tight">
                  Tiệm Len Nhà Kiều
                </span>
              </div>
            </Link>
          )}

          <button
            onClick={handleToggle}
            className="text-text-muted hover:text-text-primary rounded-md p-1.5 hover:bg-surface-hover transition-colors shrink-0"
            title={isCollapsed ? "Mở rộng sidebar" : "Thu nhỏ sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                href={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center rounded-md text-xs font-medium transition-all duration-200 group ${
                  isCollapsed ? "justify-center h-10 px-0" : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-emerald-600 text-bg-deep font-bold shadow-md shadow-primary/20"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }`}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <div
                    className={`transition-transform group-hover:scale-110 ${
                      isActive
                        ? "text-bg-deep"
                        : "text-text-muted group-hover:text-text-primary"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  {isCollapsed && item.badge !== undefined && (
                    <span
                      className={`absolute -top-1.5 -right-2.5 rounded-full min-w-[16px] h-4 px-1 text-[9px] font-extrabold flex items-center justify-center leading-none shadow-sm ${
                        isActive
                          ? "bg-bg-deep text-primary border border-primary/30"
                          : "bg-status-danger text-white border border-surface"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <>
                    <span className="truncate">{item.name}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold shrink-0 ${
                          isActive
                            ? "bg-bg-deep text-primary font-extrabold"
                            : "bg-status-danger/20 text-status-danger border border-status-danger/30"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* {!isCollapsed && (
        <div className="p-3 border-t border-border bg-surface-muted/30 text-[11px] text-text-muted select-none text-center">
          v1.0.0 Admin Control Center
        </div>
      )} */}
    </aside>
  );
}
