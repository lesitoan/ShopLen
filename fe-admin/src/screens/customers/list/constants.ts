export type CustomerStatus = "ACTIVE" | "LOCKED";
export type CustomerStatusFilter = "ALL" | CustomerStatus;

export interface CustomerListItem {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalSpent: number;
  totalOrders: number;
  rewardPoints: number;
  status: CustomerStatus;
  joinedAt: string;
  lastOrderAt: string;
}

export interface CustomerFilterState {
  searchQuery: string;
  statusFilter: CustomerStatusFilter;
  page: number;
  pageSize: number;
}

export const MOCK_CUSTOMERS_DATA: CustomerListItem[] = [
  {
    id: "cust_01",
    code: "KH-001",
    name: "Nguyễn Thị Phương Thảo",
    email: "thao.nguyen@gmail.com",
    phone: "0905123456",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    totalSpent: 4850000,
    totalOrders: 18,
    rewardPoints: 485,
    status: "ACTIVE",
    joinedAt: "2023-11-10",
    lastOrderAt: "Vừa xong",
  },
  {
    id: "cust_02",
    code: "KH-002",
    name: "Trần Minh Khoa",
    email: "khoa.tran@outlook.com",
    phone: "0914987654",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    totalSpent: 2650000,
    totalOrders: 9,
    rewardPoints: 265,
    status: "ACTIVE",
    joinedAt: "2023-12-05",
    lastOrderAt: "2 ngày trước",
  },
  {
    id: "cust_03",
    code: "KH-003",
    name: "Lê Mỹ Duyên",
    email: "duyen.le@yahoo.com",
    phone: "0988112233",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    totalSpent: 890000,
    totalOrders: 4,
    rewardPoints: 89,
    status: "ACTIVE",
    joinedAt: "2024-01-02",
    lastOrderAt: "5 ngày trước",
  },
  {
    id: "cust_04",
    code: "KH-004",
    name: "Phạm Hải Đăng",
    email: "haidang.pham@gmail.com",
    phone: "0977665544",
    totalSpent: 120000,
    totalOrders: 1,
    rewardPoints: 12,
    status: "ACTIVE",
    joinedAt: "2024-02-14",
    lastOrderAt: "10 ngày trước",
  },
  {
    id: "cust_05",
    code: "KH-005",
    name: "Vũ Bảo Ngọc",
    email: "baongoc.vu@gmail.com",
    phone: "0933445566",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    totalSpent: 1450000,
    totalOrders: 6,
    rewardPoints: 145,
    status: "LOCKED",
    joinedAt: "2023-10-20",
    lastOrderAt: "1 tháng trước",
  },
];
