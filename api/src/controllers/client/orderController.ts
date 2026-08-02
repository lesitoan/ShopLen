import type { Request, Response } from "express";
import type {
  CancelOrderRequestDto,
  CreateOrderRequestDto,
  ListOrdersQueryDto,
  LookupOrderRequestDto,
  UpdateOrderShippingAddressRequestDto,
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
  async lookupOrder(request: Request, response: Response) {
    const order = await orderService.lookupOrder(
      request.body as LookupOrderRequestDto,
    );

    return sendSuccess(response, order);
  },
  async getOrderDetail(request: Request, response: Response) {
    const order = await orderService.getOrderDetail(
      request.customerId ?? "",
      request.params.id,
    );
    return sendSuccess(response, order);
  },
  async cancelOrder(request: Request, response: Response) {
    const result = await orderService.cancelOrder(
      request.customerId ?? "",
      request.params.id,
      request.body as CancelOrderRequestDto,
    );

    return sendSuccess(response, { orderStatus: result.orderStatus }, result.message);
  },
  async updateShippingAddress(request: Request, response: Response) {
    const shippingAddress = await orderService.updateShippingAddress(
      request.customerId ?? "",
      request.params.id,
      request.body as UpdateOrderShippingAddressRequestDto,
    );

    return sendSuccess(response, shippingAddress, "Da cap nhat dia chi giao hang.");
  },
};
