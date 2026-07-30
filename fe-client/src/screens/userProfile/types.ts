export type ProfileTab = "PROFILE" | "ORDERS" | "ADDRESSES" | "CHANGE_PASSWORD";

export type OrderStatus =
  | "ALL"
  | "PENDING_PAYMENT"
  | "PENDING"
  | "PACKING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: "Nam" | "Nữ" | "Khác";
  birthday: string;
  avatar: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface OrderSummary {
  id: string;
  orderCode: string;
  createdAt: string;
  status: OrderStatus;
  statusLabel: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  paymentMethod: string;
}

export interface AddressItem {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  province: string;
  isDefault: boolean;
}

export interface PersonalInfoFormData {
  fullName: string;
  phone: string;
  email: string;
  gender: "Nam" | "Nữ" | "Khác";
  birthday: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
