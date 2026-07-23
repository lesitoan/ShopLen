import { BadgeProps } from "@/components/ui/Badge";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PACKING"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderStatusConfig {
  label: string;
  variant: NonNullable<BadgeProps["variant"]>;
  dot?: boolean;
}

export const ORDER_STATUS_MAP: Record<string, OrderStatusConfig> = {
  PAID: { label: "Đã thanh toán", variant: "success", dot: true },
  PENDING_PAYMENT: { label: "Chờ VietQR", variant: "warning", dot: true },
  PACKING: { label: "Đang đóng gói", variant: "info", dot: true },
  SHIPPING: { label: "Đang giao hàng", variant: "info", dot: true },
  COMPLETED: { label: "Hoàn tất", variant: "success", dot: true },
  CANCELLED: { label: "Đã hủy", variant: "danger", dot: true },
};
