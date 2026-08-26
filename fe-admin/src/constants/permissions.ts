import type { UserRole } from "@/types/auth.type";

export type PermissionKey =
  | "dashboard.view"
  | "orders.read"
  | "orders.update"
  | "orders.cancel"
  | "products.read"
  | "products.create_update"
  | "products.delete"
  | "categories.read"
  | "categories.create_update"
  | "customers.read"
  | "promotions.read"
  | "promotions.manage"
  | "rewards.manage"
  | "blog.read"
  | "blog.create_update"
  | "blog.delete"
  | "staff.manage"
  | "analytics.view"
  | "settings.manage";

export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[] | string[]> = {
  SUPER_ADMIN: ["*"],
  ADMIN: [
    "dashboard.view",
    "orders.read",
    "orders.update",
    "orders.cancel",
    "products.read",
    "products.create_update",
    "products.delete",
    "categories.read",
    "categories.create_update",
    "customers.read",
    "promotions.read",
    "promotions.manage",
    "rewards.manage",
    "blog.read",
    "blog.create_update",
    "blog.delete",
    "staff.manage",
    "analytics.view",
    "settings.manage",
  ],
  STAFF_ORDER: [
    "dashboard.view",
    "orders.read",
    "orders.update",
    "orders.cancel",
    "products.read",
    "categories.read",
    "customers.read",
  ],
  STAFF_CONTENT: [
    "dashboard.view",
    "products.read",
    "categories.read",
    "blog.read",
    "blog.create_update",
    "blog.delete",
  ],
};

export const ROUTE_PERMISSION_MAP: Record<string, PermissionKey> = {
  "/": "dashboard.view",
  "/orders": "orders.read",
  "/products": "products.read",
  "/categories": "categories.read",
  "/customers": "customers.read",
  "/promotions": "promotions.read",
  "/rewards": "rewards.manage",
  "/blog": "blog.read",
  "/staff": "staff.manage",
  "/analytics": "analytics.view",
  "/settings": "settings.manage",
};

export const ROLE_DEFAULT_ROUTE_MAP: Record<UserRole, string> = {
  SUPER_ADMIN: "/",
  ADMIN: "/",
  STAFF_ORDER: "/orders",
  STAFF_CONTENT: "/blog",
};


export function getDefaultRouteForRole(role: UserRole | null | undefined): string {
  if (!role) return "/";
  return ROLE_DEFAULT_ROUTE_MAP[role] ?? "/";
}

export function checkRolePermission(
  role: UserRole | null | undefined,
  permission: PermissionKey,
): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] as string[];
  if (!permissions) return false;
  if (permissions.includes("*")) return true;
  return permissions.includes(permission);
}
