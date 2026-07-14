import type { Request, Response } from "express";
import { orderService } from "../services/orderService.js";
import { sendCreated, sendSuccess } from "../utils/httpResponse.js";

export const orderController = {
  async createOrder(_request: Request, response: Response) {
    const order = await orderService.createOrder();
    return sendCreated(response, order);
  },
  async getOrderDetail(request: Request, response: Response) {
    const order = await orderService.getOrderDetail(request.params.id);
    return sendSuccess(response, order);
  },
  async confirmPayment(request: Request, response: Response) {
    const order = await orderService.confirmPayment(request.params.id);
    return sendSuccess(response, order);
  },
};
