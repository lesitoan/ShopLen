import type { Request, Response } from "express";
import { adminOrderService } from "@/services/admin/adminOrderService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const adminOrderController = {
  async getOrderDetail(request: Request, response: Response) {
    const order = await adminOrderService.getOrderDetail(request.params.id);
    return sendSuccess(response, order);
  },
  async confirmPayment(request: Request, response: Response) {
    const order = await adminOrderService.confirmPayment(request.params.id);
    return sendSuccess(response, order);
  },
};
