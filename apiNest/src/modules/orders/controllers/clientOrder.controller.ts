import { Controller, Get, HttpCode, Inject, Patch, Post, UseGuards } from "@nestjs/common";
import { CustomerAuthGuard } from "@/modules/auth/guards/customerAuth.guard.js";
import { CurrentCustomer } from "@/modules/auth/decorators/authActor.decorator.js";
import type { CustomerSession } from "@/modules/auth/types/clientAuth.type.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { createdResponse, successResponse } from "@/common/responses/httpResponse.js";
import { ClientOrderService } from "@/modules/orders/services/clientOrder.service.js";
import { createOrderDto, listOrdersDto, lookupOrderDto, getOrderDetailDto, type CreateOrderRequestDto, type ListOrdersQueryDto, type LookupOrderRequestDto } from "@/modules/orders/dto/clientOrder.dto.js";
import { cancelOrderDto, updateOrderShippingAddressDto, type CancelOrderRequestDto, type UpdateOrderShippingAddressRequestDto } from "@/modules/orders/dto/clientOrder.dto.js";

@Controller("orders")
export class ClientOrderController {
  constructor(@Inject(ClientOrderService) private readonly service: ClientOrderService) {}

  @Post("lookup")
  @HttpCode(200)
  async lookup(@ValidatedRequest(lookupOrderDto) input: { body: LookupOrderRequestDto }) {
    return successResponse(await this.service.lookupOrder(input.body));
  }

  @Post()
  @UseGuards(CustomerAuthGuard)
  async create(@CurrentCustomer() customer: CustomerSession, @ValidatedRequest(createOrderDto) input: { body: CreateOrderRequestDto }) {
    return createdResponse(await this.service.createOrder(customer.id, input.body));
  }

  @Get()
  @UseGuards(CustomerAuthGuard)
  async list(@CurrentCustomer() customer: CustomerSession, @ValidatedRequest(listOrdersDto) input: { query: ListOrdersQueryDto }) {
    return successResponse(await this.service.listOrders(customer.id, input.query));
  }

  @Get(":id")
  @UseGuards(CustomerAuthGuard)
  async detail(@CurrentCustomer() customer: CustomerSession, @ValidatedRequest(getOrderDetailDto) input: { params: { id: string } }) {
    return successResponse(await this.service.getOrderDetail(customer.id, input.params.id));
  }

  @Post(":id/cancel")
  @HttpCode(200)
  @UseGuards(CustomerAuthGuard)
  async cancel(@CurrentCustomer() customer: CustomerSession, @ValidatedRequest(cancelOrderDto) input: { params: { id: string }; body: CancelOrderRequestDto }) {
    const result = await this.service.cancelOrder(customer.id, input.params.id, input.body);
    return successResponse({ orderStatus: result.orderStatus }, result.message);
  }

  @Patch(":id/shipping-address")
  @UseGuards(CustomerAuthGuard)
  async shipping(@CurrentCustomer() customer: CustomerSession, @ValidatedRequest(updateOrderShippingAddressDto) input: { params: { id: string }; body: UpdateOrderShippingAddressRequestDto }) {
    return successResponse(await this.service.updateShippingAddress(customer.id, input.params.id, input.body), "Da cap nhat dia chi giao hang.");
  }
}
