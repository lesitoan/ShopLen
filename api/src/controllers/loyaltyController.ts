import type { Request, Response } from "express";
import { loyaltyService } from "../services/loyaltyService.js";
import { sendSuccess } from "../utils/httpResponse.js";

export const loyaltyController = {
  async getCustomerPoints(request: Request, response: Response) {
    const points = await loyaltyService.getCustomerPoints(request.params.userId);
    return sendSuccess(response, points);
  },
};
