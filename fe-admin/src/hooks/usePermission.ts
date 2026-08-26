"use client";

import { useAppSelector } from "@/store/hooks";
import {
  checkRolePermission,
  getDefaultRouteForRole,
  ROUTE_PERMISSION_MAP,
  type PermissionKey,
} from "@/constants/permissions";
import type { UserRole } from "@/types/auth.type";

export function usePermission() {
  const { admin, isInitialized } = useAppSelector((state) => state.auth);
  const role = admin?.role;

  const hasPermission = (permission: PermissionKey): boolean => {
    return checkRolePermission(role, permission);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(role);
    }
    return role === roles;
  };

  const canAccessRoute = (path: string): boolean => {
    if (path === "/") {
      const requiredPermission = ROUTE_PERMISSION_MAP["/"];
      return requiredPermission ? hasPermission(requiredPermission) : true;
    }

    const routeKeys = Object.keys(ROUTE_PERMISSION_MAP)
      .filter((k) => k !== "/")
      .sort((a, b) => b.length - a.length);

    const matchedKey = routeKeys.find((routePath) =>
      path === routePath || path.startsWith(`${routePath}/`)
    );

    if (!matchedKey) return true;
    return hasPermission(ROUTE_PERMISSION_MAP[matchedKey]);
  };

  const getDefaultRoute = (): string => {
    return getDefaultRouteForRole(role);
  };

  return {
    admin,
    role,
    isInitialized,
    hasPermission,
    hasRole,
    canAccessRoute,
    getDefaultRoute,
  };
}
