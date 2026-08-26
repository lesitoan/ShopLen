"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePermission } from "@/hooks/usePermission";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { canAccessRoute, getDefaultRoute, isInitialized, admin } = usePermission();

  const isAllowed = canAccessRoute(pathname);

  useEffect(() => {
    if (isInitialized && admin && !isAllowed) {
      const defaultRoute = getDefaultRoute();
      if (pathname !== defaultRoute) {
        router.replace(defaultRoute);
      }
    }
  }, [isInitialized, admin, isAllowed, router, getDefaultRoute, pathname]);

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
            {isAllowed ? children : null}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
