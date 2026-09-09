import { LucideIcon } from "lucide-react";
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
} from "lucide-react";
import type { PermissionKey } from "@/constants/permissions";

export interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
  permission?: PermissionKey;
}

export const NAV_MENU_ITEMS: MenuItem[] = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, permission: "dashboard.view" },
  { name: "Đơn hàng", path: "/orders", icon: ShoppingBag, permission: "orders.read" },
  { name: "Sản phẩm", path: "/products", icon: Package, permission: "products.read" },
  { name: "Danh mục", path: "/categories", icon: FolderTree, permission: "categories.read" },
  { name: "Khách hàng", path: "/customers", icon: Users, permission: "customers.read" },
  // { name: "Khuyến mãi", path: "/promotions", icon: Percent, permission: "promotions.read" },
  // { name: "Điểm thưởng", path: "/rewards/config", icon: Award, permission: "rewards.manage" },
  { name: "Bài viết", path: "/blog", icon: FileText, permission: "blog.read" },
  { name: "Nhân viên", path: "/staff", icon: UserCheck, permission: "staff.manage" },
  { name: "Thống kê", path: "/analytics", icon: BarChart3, permission: "analytics.view" },
  { name: "Cấu hình", path: "/settings", icon: Settings, permission: "settings.manage" },
];

export const BREADCRUMB_ROUTE_MAP: Record<string, string> = {
  "": "Dashboard",
  orders: "Đơn hàng",
  products: "Sản phẩm",
  categories: "Danh mục",
  customers: "Khách hàng",
  promotions: "Khuyến mãi",
  rewards: "Điểm thưởng",
  config: "Cấu hình",
  blog: "Bài viết",
  staff: "Nhân viên",
  analytics: "Thống kê",
  settings: "Cấu hình hệ thống",
  new: "Thêm mới",
};
