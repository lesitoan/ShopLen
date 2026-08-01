import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Check,
  type LucideIcon,
} from "lucide-react";

export interface OrderStatusStepItem {
  key: string;
  step: number;
  label: string;
  desc: string;
  icon: LucideIcon;
}

export const ORDER_STATUS_STEPS: OrderStatusStepItem[] = [
  {
    key: "CREATED",
    step: 1,
    label: "Đã chốt đơn",
    desc: "Hệ thống ghi nhận đơn hàng",
    icon: Clock,
  },
  {
    key: "PAYMENT_CONFIRMED",
    step: 2,
    label: "Xác nhận chuyển khoản",
    desc: "Đã nhận chuyển khoản",
    icon: CheckCircle2,
  },
  {
    key: "CRAFTING",
    step: 3,
    label: "Đang móc thủ công",
    desc: "Thợ tỉ mỉ hoàn thiện sản phẩm",
    icon: Package,
  },
  {
    key: "SHIPPING",
    step: 4,
    label: "Đang giao hàng",
    desc: "Đơn vị vận chuyển đang giao",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    step: 5,
    label: "Giao thành công",
    desc: "Khách đã nhận quà tặng",
    icon: Check,
  },
];

export const getActiveStepIndex = (status: string): number => {
  switch (status) {
    case "PENDING_PAYMENT":
    case "CREATED":
      return 0;
    case "PAID":
    case "PAYMENT_CONFIRMED":
    case "PENDING":
      return 1;
    case "CRAFTING":
    case "PACKING":
      return 2;
    case "SHIPPING":
      return 3;
    case "COMPLETED":
    case "DELIVERED":
      return 4;
    default:
      return 0;
  }
};
