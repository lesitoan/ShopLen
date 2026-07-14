export const loyaltyService = {
  async getCustomerPoints(userId: string) {
    return { userId, points: 0 };
  },
};
