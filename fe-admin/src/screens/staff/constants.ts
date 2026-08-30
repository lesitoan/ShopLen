export type StaffRole = "SUPER_ADMIN" | "ADMIN" | "STAFF_ORDER" | "STAFF_CONTENT";
export type StaffStatus = "ACTIVE" | "LOCKED";

export type StaffRoleFilter = "ALL" | StaffRole;
export type StaffStatusFilter = "ALL" | StaffStatus;

export interface StaffListItem {
  id: string;
  code: string;
  name: string;
  fullName?: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: StaffRole;
  roleName: string;
  status: StaffStatus;
  lastLoginAt: string;
  createdAt: string;
  pw?: string;
  pwConfirm?: string;
}

export interface StaffFilterState {
  page: number;
  limit: number;
  search: string;
  role: StaffRoleFilter;
  status: StaffStatusFilter;
  searchQuery?: string;
  roleFilter?: StaffRoleFilter;
  statusFilter?: StaffStatusFilter;
  pageSize?: number;
}

export const DEFAULT_STAFF_FILTERS: StaffFilterState = {
  page: 1,
  limit: 10,
  search: "",
  role: "ALL",
  status: "ALL",
};

export const ROLE_NAME_MAP: Record<StaffRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  STAFF_ORDER: "CTV check đơn",
  STAFF_CONTENT: "CTV đăng bài",
};

export interface RolePermissionGroup {
  groupName: string;
  permissions: {
    key: string;
    label: string;
    superAdminHas: boolean;
    adminHas: boolean;
    staffOrderHas: boolean;
    staffContentHas: boolean;
  }[];
}

export const MOCK_ROLES: { key: StaffRole; name: string; description: string }[] = [
  {
    key: "SUPER_ADMIN",
    name: "Super Admin",
    description: "Toàn quyền quản trị cao nhất toàn bộ hệ thống",
  },
  {
    key: "ADMIN",
    name: "Admin",
    description: "Quản trị viên hệ thống (Không có quyền xóa Admin khác & Super Admin)",
  },
  {
    key: "STAFF_ORDER",
    name: "CTV check đơn",
    description: "Nhân viên kiểm tra, xác nhận và xử lý đơn hàng",
  },
  {
    key: "STAFF_CONTENT",
    name: "CTV đăng bài",
    description: "Cộng tác viên biên soạn bài viết blog (Xóa bài cần Admin/Super Admin duyệt)",
  },
];

export const MOCK_PERMISSION_MATRIX: RolePermissionGroup[] = [
  {
    groupName: "Quản lý Đơn hàng",
    permissions: [
      { key: "order:read", label: "Xem danh sách & chi tiết đơn hàng", superAdminHas: true, adminHas: true, staffOrderHas: true, staffContentHas: false },
      { key: "order:update", label: "Cập nhật trạng thái đơn hàng", superAdminHas: true, adminHas: true, staffOrderHas: true, staffContentHas: false },
      { key: "order:cancel", label: "Hủy đơn hàng & hoàn tiền", superAdminHas: true, adminHas: true, staffOrderHas: true, staffContentHas: false },
    ],
  },
  {
    groupName: "Quản lý Sản phẩm & Danh mục",
    permissions: [
      { key: "product:read", label: "Xem danh sách sản phẩm", superAdminHas: true, adminHas: true, staffOrderHas: true, staffContentHas: false },
      { key: "product:create_update", label: "Thêm mới & Sửa sản phẩm", superAdminHas: true, adminHas: true, staffOrderHas: false, staffContentHas: false },
      { key: "product:delete", label: "Xóa sản phẩm", superAdminHas: true, adminHas: true, staffOrderHas: false, staffContentHas: false },
    ],
  },
  {
    groupName: "Quản lý Nội dung & Blog CMS",
    permissions: [
      { key: "blog:read", label: "Xem danh sách bài viết blog", superAdminHas: true, adminHas: true, staffOrderHas: false, staffContentHas: true },
      { key: "blog:create_update", label: "Soạn thảo & Đăng bài viết", superAdminHas: true, adminHas: true, staffOrderHas: false, staffContentHas: true },
      { key: "blog:delete", label: "Xóa bài viết (Cần gửi yêu cầu duyệt)", superAdminHas: true, adminHas: true, staffOrderHas: false, staffContentHas: true },
    ],
  },
  {
    groupName: "Nhân viên & Phân quyền",
    permissions: [
      { key: "staff:manage", label: "Quản lý danh sách nhân viên", superAdminHas: true, adminHas: true, staffOrderHas: false, staffContentHas: false },
      { key: "staff:delete_admin", label: "Xóa tài khoản Admin", superAdminHas: true, adminHas: false, staffOrderHas: false, staffContentHas: false },
    ],
  },
];

