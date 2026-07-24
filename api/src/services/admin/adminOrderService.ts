import { ORDER_STATUS } from "@/constants/orderStatus.js";

export const adminOrderService = {
  async getOrderDetail(orderId: string) {
    return { orderId };
  },
  async confirmPayment(orderId: string) {
    return { orderId, orderStatus: ORDER_STATUS.paid };
  },
};
