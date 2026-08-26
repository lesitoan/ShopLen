"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Loading } from "@/components/ui/Loading";
import { getDefaultRouteForRole } from "@/constants/permissions";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const { admin, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) return;

    if (requireAuth && !admin) {
      router.replace("/login");
    } else if (!requireAuth && admin) {
      const defaultRoute = getDefaultRouteForRole(admin.role);
      router.replace(defaultRoute);
    }
  }, [admin, isInitialized, requireAuth, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-bg-dark text-text-primary">
        <Loading size="lg" />
        <span className="text-sm text-text-muted">Đang xác thực phiên làm việc...</span>
      </div>
    );
  }

  if (requireAuth && !admin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-bg-dark text-text-primary">
        <Loading size="lg" />
        <span className="text-sm text-text-muted">Đang chuyển hướng đến trang đăng nhập...</span>
      </div>
    );
  }

  if (!requireAuth && admin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-bg-dark text-text-primary">
        <Loading size="lg" />
        <span className="text-sm text-text-muted">Đang chuyển hướng đến trang quản trị...</span>
      </div>
    );
  }

  return <>{children}</>;
}
