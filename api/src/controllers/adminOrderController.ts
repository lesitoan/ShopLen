import type { Request, Response } from "express";
import { orderService } from "../services/orderService.js";
import { sendSuccess } from "../utils/httpResponse.js";

export const adminOrderController = {
  async getOrderDetail(request: Request, response: Response) {
    const order = await orderService.getOrderDetail(request.params.id);
    return sendSuccess(response, order);
  },
  async confirmPayment(request: Request, response: Response) {
    const order = await orderService.confirmPayment(request.params.id);
    return sendSuccess(response, order);
  },
};
