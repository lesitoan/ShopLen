import { ORDER_STATUS } from "../constants/orderStatus.js";
import { generateOrderCode } from "../utils/generateOrderCode.js";

export const orderService = {
  async createOrder() {
    return {
      orderCode: generateOrderCode(),
      orderStatus: ORDER_STATUS.pending,
    };
  },
  async getOrderDetail(orderId: string) {
    return { orderId };
  },
  async confirmPayment(orderId: string) {
    return { orderId, orderStatus: ORDER_STATUS.paid };
  },
};
