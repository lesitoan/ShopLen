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

export interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
}

export const NAV_MENU_ITEMS: MenuItem[] = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Đơn hàng", path: "/orders", icon: ShoppingBag, badge: 3 },
  { name: "Sản phẩm", path: "/products", icon: Package },
  { name: "Danh mục", path: "/categories", icon: FolderTree },
  { name: "Khách hàng", path: "/customers", icon: Users },
  { name: "Khuyến mãi", path: "/promotions", icon: Percent },
  { name: "Điểm thưởng", path: "/rewards/config", icon: Award },
  { name: "Bài viết", path: "/blog", icon: FileText },
  { name: "Nhân viên", path: "/staff", icon: UserCheck },
  { name: "Thống kê", path: "/analytics", icon: BarChart3 },
  { name: "Cấu hình", path: "/settings", icon: Settings },
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
