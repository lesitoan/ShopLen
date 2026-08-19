"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-transparent flex text-text-primary">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
            isCollapsed ? "pl-16" : "pl-64"
          }`}
        >
          <Topbar isCollapsed={isCollapsed} />

          <main className="flex-1 p-6 pt-24 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

