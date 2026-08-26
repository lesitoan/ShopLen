"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import type { PermissionKey } from "@/constants/permissions";
import type { UserRole } from "@/types/auth.type";

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredPermission?: PermissionKey;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  requiredPermission,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission, hasRole, role, isInitialized, getDefaultRoute } = usePermission();

  const isAllowedPermission = requiredPermission
    ? hasPermission(requiredPermission)
    : true;

  const isAllowedRole = allowedRoles ? hasRole(allowedRoles) : true;

  const isAllowed = Boolean(role && isAllowedPermission && isAllowedRole);

  useEffect(() => {
    if (isInitialized && !isAllowed) {
      const defaultRoute = getDefaultRoute();
      if (pathname !== defaultRoute) {
        router.replace(defaultRoute);
      }
    }
  }, [isInitialized, isAllowed, router, getDefaultRoute, pathname]);

  if (!isInitialized || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}
