export const ORDER_STATUS = {
  pending: "pending",
  paid: "paid",
  packing: "packing",
  shipping: "shipping",
  completed: "completed",
  cancelled: "cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
