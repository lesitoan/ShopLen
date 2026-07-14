import { MESSAGES } from "../constants/messages.js";

export const paymentService = {
  async createPaymentQr(orderId: string) {
    return { orderId, message: MESSAGES.FEATURE_NOT_IMPLEMENTED };
  },
  async handleWebhook() {
    return { received: true };
  },
};
