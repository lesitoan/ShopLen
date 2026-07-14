export const telegramService = {
  async notifyNewOrder(orderCode: string) {
    return { orderCode, sent: false };
  },
};
