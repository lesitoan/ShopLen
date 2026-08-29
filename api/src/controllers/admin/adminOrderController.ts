import type { Request, Response } from "express";
import type {
  AdminOrderListQueryDto,
  UpdateAdminOrderStatusDto,
} from "@/dto/admin/adminOrderDto.js";
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

  async updateOrderStatus(request: Request, response: Response) {
    const payload = request.body as UpdateAdminOrderStatusDto;
    const order = await adminOrderService.updateOrderStatus(
      request.params.id,
      payload,
    );
    return sendSuccess(response, order, "Cập nhật trạng thái đơn hàng thành công.");
  },

  async confirmPayment(request: Request, response: Response) {
    const order = await adminOrderService.confirmPayment(request.params.id);
    return sendSuccess(response, order, "Xác nhận thanh toán thành công.");
  },
};
