export interface CustomerOrderHistoryItem {
  id: string;
  code: string;
  date: string;
  itemCount: number;
  totalAmount: number;
  status: "COMPLETED" | "CANCELLED" | "PENDING";
  statusLabel: string;
}

export interface CustomerPointHistoryItem {
  id: string;
  date: string;
  change: number;
  reason: string;
  balanceAfter: number;
}

export interface CustomerAdminNoteItem {
  id: string;
  author: string;
  createdAt: string;
  content: string;
}

export const MOCK_CUSTOMER_ORDERS: CustomerOrderHistoryItem[] = [
  {
    id: "ord_1001",
    code: "ORD-LEN-2024-001",
    date: "2024-02-20 14:30",
    itemCount: 3,
    totalAmount: 320000,
    status: "COMPLETED",
    statusLabel: "Hoàn thành",
  },
  {
    id: "ord_1002",
    code: "ORD-LEN-2024-045",
    date: "2024-02-12 09:15",
    itemCount: 1,
    totalAmount: 125000,
    status: "COMPLETED",
    statusLabel: "Hoàn thành",
  },
  {
    id: "ord_1003",
    code: "ORD-LEN-2024-088",
    date: "2024-01-28 18:40",
    itemCount: 5,
    totalAmount: 680000,
    status: "COMPLETED",
    statusLabel: "Hoàn thành",
  },
];

export const MOCK_CUSTOMER_POINTS_HISTORY: CustomerPointHistoryItem[] = [
  {
    id: "pt_1",
    date: "2024-02-20 14:35",
    change: 32,
    reason: "Tích điểm đơn hàng #ORD-LEN-2024-001",
    balanceAfter: 485,
  },
  {
    id: "pt_2",
    date: "2024-02-14 10:00",
    change: 50,
    reason: "Tặng điểm sinh nhật tháng 2",
    balanceAfter: 453,
  },
  {
    id: "pt_3",
    date: "2024-02-12 09:20",
    change: 12,
    reason: "Tích điểm đơn hàng #ORD-LEN-2024-045",
    balanceAfter: 403,
  },
];

export const MOCK_CUSTOMER_ADMIN_NOTES: CustomerAdminNoteItem[] = [
  {
    id: "note_1",
    author: "Quản trị viên",
    createdAt: "15/02/2024 16:20",
    content: "Khách thích nhận hoa len màu hồng pastel. Nên tặng kèm voucher 10% dịp sinh nhật.",
  },
];
