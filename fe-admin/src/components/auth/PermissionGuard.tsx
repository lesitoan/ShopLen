"use client";

import React from "react";
import { usePermission } from "@/hooks/usePermission";
import type { PermissionKey } from "@/constants/permissions";
import type { UserRole } from "@/types/auth.type";

export interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: PermissionKey;
  role?: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  role,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, hasRole } = usePermission();

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
