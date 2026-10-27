import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AdminAuthGuard } from "@/modules/auth/guards/adminAuth.guard.js";
import { RolesGuard } from "@/modules/auth/guards/roles.guard.js";
import { Roles } from "@/modules/auth/decorators/roles.decorator.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import {
  successResponse,
  paginatedResponse,
} from "@/common/responses/httpResponse.js";
import { AdminOrderService } from "@/modules/orders/services/adminOrder.service.js";
import {
  adminOrderListQueryDto,
  adminOrderParamsDto,
  updateAdminOrderStatusDto,
  type AdminOrderListQueryDto,
  type UpdateAdminOrderStatusDto,
} from "@/modules/orders/dto/adminOrder.dto.js";

@Controller("admin/orders")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "ADMIN", "STAFF_ORDER")
export class AdminOrderController {
  constructor(
    @Inject(AdminOrderService) private readonly service: AdminOrderService,
  ) {}

  @Get()
  async list(
    @ValidatedRequest(adminOrderListQueryDto)
    input: {
      query: AdminOrderListQueryDto;
    },
  ) {
    const result = await this.service.listOrders(input.query);
    return paginatedResponse(result.items, result.pagination);
  }

  @Get(":id")
  async detail(
    @ValidatedRequest(adminOrderParamsDto) input: { params: { id: string } },
  ) {
    return successResponse(await this.service.getOrderDetail(input.params.id));
  }

  @Patch(":id/status")
  async status(
    @ValidatedRequest(updateAdminOrderStatusDto)
    input: {
      params: { id: string };
      body: UpdateAdminOrderStatusDto;
    },
  ) {
    return successResponse(
      await this.service.updateOrderStatus(input.params.id, input.body),
      "Cập nhật trạng thái đơn hàng thành công.",
    );
  }

  @Post([":id/confirm-payment", ":id/confirmPayment"])
  @HttpCode(200)
  async confirm(
    @ValidatedRequest(adminOrderParamsDto) input: { params: { id: string } },
  ) {
    return successResponse(
      await this.service.confirmPayment(input.params.id),
      "Xác nhận thanh toán thành công.",
    );
  }
}
