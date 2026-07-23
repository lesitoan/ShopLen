"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-transparent flex text-text-primary">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? "pl-16" : "pl-64"
        }`}
      >
        <Topbar isCollapsed={isCollapsed} />

        <main className="flex-1 p-6 pt-22 overflow-x-hidden">
          {children}
        </main>

        <footer className="py-4 px-6 border-t border-border/40 text-center text-xs text-text-muted">
          Tiệm Len Nhà Kiều © 2026 Admin Dashboard. Hệ thống quản lý bán hàng.
        </footer>
      </div>
    </div>
  );
}

