import type { Request, Response } from "express";
import { promotionService } from "../services/promotionService.js";
import { sendSuccess } from "../utils/httpResponse.js";

export const promotionController = {
  async listPromotions(_request: Request, response: Response) {
    const promotions = await promotionService.listPromotions();
    return sendSuccess(response, promotions);
  },
  async validatePromotion(request: Request, response: Response) {
    const promotion = await promotionService.validatePromotion(request.body.promotionCode);
    return sendSuccess(response, promotion);
  },
};
