export const vietQrService = {
  createQrPayload(orderCode: string, amount: number) {
    return { orderCode, amount };
  },
};
