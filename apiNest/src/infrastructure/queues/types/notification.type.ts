import type { OrderStatus } from "@prisma/client";

export const NOTIFICATION_JOB_NAMES = {
  CUSTOMER_REGISTERED: "CUSTOMER_REGISTERED",
  ORDER_PAID: "ORDER_PAID",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  ORDER_SHIPPING_ADDRESS_UPDATED: "ORDER_SHIPPING_ADDRESS_UPDATED",
} as const;

export type NotificationJobName =
  (typeof NOTIFICATION_JOB_NAMES)[keyof typeof NOTIFICATION_JOB_NAMES];

export type CustomerRegisteredNotificationJobData = {
  customerId: string;
  code: string;
  fullName: string;
  email: string;
  phone?: string | null;
  registerMethod: "EMAIL" | "GOOGLE";
  registeredAt: string;
};

export type OrderPaidNotificationJobData = {
  orderId: string;
  orderCode: string;
  customerName?: string;
  customerPhone?: string;
  totalAmount?: number;
  paidAt: string;
};

export type OrderCancelledNotificationJobData = {
  orderId: string;
  orderCode?: string;
  customerName?: string;
  customerPhone?: string;
  totalAmount?: number;
  orderStatus: Extract<OrderStatus, "CANCELLED" | "CANCELLATION_REQUESTED">;
  reason: string;
  cancelledAt: string;
};

export type OrderShippingAddressUpdatedNotificationJobData = {
  orderId: string;
  orderCode?: string;
  customerName?: string;
  customerPhone?: string;
  oldShippingAddress: string;
  newShippingAddress: string;
  updatedAt: string;
};

export type NotificationJobData =
  | CustomerRegisteredNotificationJobData
  | OrderPaidNotificationJobData
  | OrderCancelledNotificationJobData
  | OrderShippingAddressUpdatedNotificationJobData;
