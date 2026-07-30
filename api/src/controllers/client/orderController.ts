import type { Request, Response } from "express";
import type {
  CreateOrderRequestDto,
  ListOrdersQueryDto,
} from "@/dto/client/orderDto.js";
import { orderService } from "@/services/client/orderService.js";
import { sendCreated, sendSuccess } from "@/utils/httpResponse.js";

export const orderController = {
  async createOrder(request: Request, response: Response) {
    const order = await orderService.createOrder(
      request.customerId ?? "",
      request.body as CreateOrderRequestDto,
    );

    return sendCreated(response, order);
  },
  async listOrders(request: Request, response: Response) {
    const orders = await orderService.listOrders(
      request.customerId ?? "",
      request.query as ListOrdersQueryDto,
    );

    return sendSuccess(response, orders);
  },
  async getOrderDetail(request: Request, response: Response) {
    const order = await orderService.getOrderDetail(
      request.customerId ?? "",
      request.params.id,
    );
    return sendSuccess(response, order);
  },
};
