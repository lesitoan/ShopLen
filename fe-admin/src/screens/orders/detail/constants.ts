import { OrderStatus } from "@/constants/orders";

export interface OrderLineItem {
  id: string;
  productId: string;
  title: string;
  variantName: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderFinancial {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  voucherCode?: string;
}

export interface OrderCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  address: string;
  note?: string;
  totalOrdersCount: number;
}

export interface OrderPaymentInfo {
  method: string;
  status: "PAID" | "PENDING";
  bankName: string;
  accountNo: string;
  accountName: string;
  transactionRef?: string;
  paidAt?: string;
  isMatched: boolean;
}

export interface OrderTimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: "SYSTEM" | "BOT" | "ADMIN" | "CUSTOMER";
  isDone: boolean;
  isCurrent?: boolean;
}

export interface OrderDetail {
  id: string;
  orderCode: string;
  createdAt: string;
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderLineItem[];
  financial: OrderFinancial;
  payment: OrderPaymentInfo;
  timeline: OrderTimelineItem[];
  adminNotes: string;
  cancelReason?: string;
}

export const MOCK_ORDER_DETAIL: OrderDetail = {
  id: "TLK-88392",
  orderCode: "TLK-88392",
  createdAt: "2026-07-23 14:32:10",
  status: "PENDING_PAYMENT",
  customer: {
    id: "CUST-102",
    name: "Nguyễn Thị Ngọc Ánh",
    phone: "0987 654 321",
    email: "ngocanh.len@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    address: "Số 45, Đường Lê Văn Lương, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội",
    note: "Giao trong giờ hành chính giúp em nhé, trước 5h chiều ạ!",
    totalOrdersCount: 4,
  },
  items: [
    {
      id: "ITEM-1",
      productId: "PROD-01",
      title: "Móc khóa len Thỏ Mập Tai Dài",
      variantName: "Hồng Nhạt (Len Milk Cotton)",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=80",
      price: 65000,
      quantity: 2,
      total: 130000,
    },
    {
      id: "ITEM-2",
      productId: "PROD-03",
      title: "Móc khóa len Bơ Mini Đáng Yêu",
      variantName: "Xanh Bơ (Size S)",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80",
      price: 45000,
      quantity: 1,
      total: 45000,
    },
    {
      id: "ITEM-3",
      productId: "PROD-05",
      title: "Móc khóa len Hoa Hướng Dương Handcrafted",
      variantName: "Vàng Tươi",
      image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=150&auto=format&fit=crop&q=80",
      price: 35000,
      quantity: 1,
      total: 35000,
    },
  ],
  financial: {
    subtotal: 210000,
    shippingFee: 20000,
    discountAmount: 15000,
    totalAmount: 215000,
    voucherCode: "TIEMLENKIEU15K",
  },
  payment: {
    method: "Chuyển khoản ngân hàng",
    status: "PENDING",
    bankName: "MB Bank (Ngân hàng Quân Đội)",
    accountNo: "9999 8888 6666",
    accountName: "TIEM LEN NHA KIEU",
    transactionRef: "MBVCB.74839201",
    paidAt: undefined,
    isMatched: false,
  },
  timeline: [
    {
      id: "TL-1",
      title: "Đơn hàng được khởi tạo",
      description: "Khách hàng đặt hàng qua Website Tiệm Len Nhà Kiều",
      timestamp: "2026-07-23 14:32:10",
      actor: "CUSTOMER",
      isDone: true,
    },
    {
      id: "TL-2",
      title: "Chờ thanh toán",
      description: "Khách hàng lựa chọn phương thức thanh toán chuyển khoản ngân hàng 215.000đ",
      timestamp: "2026-07-23 14:32:12",
      actor: "SYSTEM",
      isDone: true,
      isCurrent: true,
    },
    {
      id: "TL-3",
      title: "Xác nhận đã thanh toán",
      description: "Hệ thống hoặc Admin xác thực giao dịch khớp mã đơn",
      timestamp: "—",
      actor: "BOT",
      isDone: false,
    },
    {
      id: "TL-4",
      title: "Đóng gói sản phẩm",
      description: "Nhân viên kho kiểm tra và chuẩn bị móc khóa len",
      timestamp: "—",
      actor: "ADMIN",
      isDone: false,
    },
    {
      id: "TL-5",
      title: "Đang giao hàng",
      description: "Bàn giao cho đơn vị vận chuyển ViettelPost / GHN",
      timestamp: "—",
      actor: "SYSTEM",
      isDone: false,
    },
    {
      id: "TL-6",
      title: "Hoàn tất đơn hàng",
      description: "Khách hàng đã nhận được kiện hàng",
      timestamp: "—",
      actor: "CUSTOMER",
      isDone: false,
    },
  ],
  adminNotes: "Khách gọi hotline dặn bọc chống xóc kỹ cho móc khóa bông.",
};
