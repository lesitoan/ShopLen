export type StaffRole = "SUPER_ADMIN" | "ADMIN" | "STAFF_ORDER" | "STAFF_CONTENT";
export type StaffStatus = "ACTIVE" | "LOCKED";

export type StaffRoleFilter = "ALL" | StaffRole;
export type StaffStatusFilter = "ALL" | StaffStatus;

export interface StaffListItem {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: StaffRole;
  roleName: string;
  status: StaffStatus;
  lastLoginAt: string;
  createdAt: string;
}

export interface StaffFilterState {
  searchQuery: string;
  roleFilter: StaffRoleFilter;
  statusFilter: StaffStatusFilter;
  page: number;
  pageSize: number;
}

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

export const MOCK_STAFF_DATA: StaffListItem[] = [
  {
    id: "staff_01",
    code: "NV-001",
    name: "Kiều Như Ý",
    email: "nhuy.kieu@tiemlennhakieu.vn",
    phone: "0909123456",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "SUPER_ADMIN",
    roleName: "Super Admin",
    status: "ACTIVE",
    lastLoginAt: "Vừa xong",
    createdAt: "2023-01-01",
  },
  {
    id: "staff_02",
    code: "NV-002",
    name: "Trần Anh Tuấn",
    email: "anhtuan.tran@tiemlennhakieu.vn",
    phone: "0912345678",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "ADMIN",
    roleName: "Admin",
    status: "ACTIVE",
    lastLoginAt: "10 phút trước",
    createdAt: "2023-06-15",
  },
  {
    id: "staff_03",
    code: "NV-003",
    name: "Nguyễn Thu Hà",
    email: "thuha.nguyen@tiemlennhakieu.vn",
    phone: "0987654321",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "STAFF_ORDER",
    roleName: "CTV check đơn",
    status: "ACTIVE",
    lastLoginAt: "2 giờ trước",
    createdAt: "2023-09-01",
  },
  {
    id: "staff_04",
    code: "NV-004",
    name: "Phạm Hoàng Nam",
    email: "hoangnam.pham@tiemlennhakieu.vn",
    phone: "0978123987",
    role: "STAFF_CONTENT",
    roleName: "CTV đăng bài",
    status: "ACTIVE",
    lastLoginAt: "Hôm qua 15:30",
    createdAt: "2023-11-20",
  },
];
