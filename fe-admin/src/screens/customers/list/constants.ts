import type {
  AdminCustomerListItem,
  CustomerStatus,
} from "@/types/customer.type";

export type { CustomerStatus, AdminCustomerListItem };
export type CustomerStatusFilter = "ALL" | CustomerStatus;

export type CustomerListItem = AdminCustomerListItem & {
  name: string;
  joinedAt?: string;
  lastOrderAt?: string;
  totalSpent?: number;
  totalOrders?: number;
  rewardPoints?: number;
};

export interface CustomerFilterState {
  page: number;
  limit: number;
  search: string;
  status: CustomerStatusFilter;
}

export const DEFAULT_CUSTOMER_FILTERS: CustomerFilterState = {
  page: 1,
  limit: 10,
  search: "",
  status: "ALL",
};

export const MOCK_CUSTOMERS_DATA: CustomerListItem[] = [
  {
    id: "cust_01",
    code: "KH-001",
    fullName: "Nguyễn Thị Phương Thảo",
    name: "Nguyễn Thị Phương Thảo",
    email: "thao.nguyen@gmail.com",
    phone: "0905123456",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    totalSpent: 4850000,
    totalOrders: 18,
    rewardPoints: 485,
    status: "ACTIVE",
    emailVerified: true,
    isManualLogin: true,
    isGoogleLogin: false,
    createdAt: "2023-11-10T08:00:00.000Z",
    updatedAt: "2023-11-10T08:00:00.000Z",
    joinedAt: "2023-11-10",
    lastOrderAt: "Vừa xong",
  },
  {
    id: "cust_02",
    code: "KH-002",
    fullName: "Trần Minh Khoa",
    name: "Trần Minh Khoa",
    email: "khoa.tran@outlook.com",
    phone: "0914987654",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    totalSpent: 2650000,
    totalOrders: 9,
    rewardPoints: 265,
    status: "ACTIVE",
    emailVerified: true,
    isManualLogin: true,
    isGoogleLogin: false,
    createdAt: "2023-12-05T09:00:00.000Z",
    updatedAt: "2023-12-05T09:00:00.000Z",
    joinedAt: "2023-12-05",
    lastOrderAt: "2 ngày trước",
  },
];
