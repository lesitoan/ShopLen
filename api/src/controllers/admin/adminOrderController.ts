import type { Request, Response } from "express";
import type { AdminOrderListQueryDto } from "@/dto/admin/adminOrderDto.js";
import { adminOrderService } from "@/services/admin/adminOrderService.js";
import { sendPaginated, sendSuccess } from "@/utils/httpResponse.js";

export const adminOrderController = {
  async listOrders(request: Request, response: Response) {
    const query = request.query as unknown as AdminOrderListQueryDto;
    const result = await adminOrderService.listOrders(query);
    return sendPaginated(response, result.items, result.pagination);
  },

  async getOrderDetail(request: Request, response: Response) {
    const order = await adminOrderService.getOrderDetail(request.params.id);
    return sendSuccess(response, order);
  },
  async confirmPayment(request: Request, response: Response) {
    const order = await adminOrderService.confirmPayment(request.params.id);
    return sendSuccess(response, order);
  },
};
