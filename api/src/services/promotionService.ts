export const promotionService = {
  async listPromotions() {
    return [];
  },
  async validatePromotion(promotionCode: string) {
    return { promotionCode, valid: false };
  },
};
