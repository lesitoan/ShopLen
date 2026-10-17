import { Controller, Get, Inject, Patch, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "@/modules/auth/guards/adminAuth.guard.js";
import { RolesGuard } from "@/modules/auth/guards/roles.guard.js";
import { Roles } from "@/modules/auth/decorators/roles.decorator.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { paginatedResponse, successResponse } from "@/common/responses/httpResponse.js";
import { AdminCustomerService } from "@/modules/customers/services/adminCustomer.service.js";
import { adminCustomerListQueryDto, adminCustomerParamsDto, updateAdminCustomerStatusDto, type AdminCustomerListQueryDto, type UpdateAdminCustomerStatusDto } from "@/modules/customers/dto/adminCustomer.dto.js";

@Controller("admin/customers")
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminCustomerController {
  constructor(@Inject(AdminCustomerService) private readonly service: AdminCustomerService) {}

  @Get()
  @Roles("SUPER_ADMIN", "ADMIN")
  async list(@ValidatedRequest(adminCustomerListQueryDto) input: { query: AdminCustomerListQueryDto }) {
    const result = await this.service.listCustomers(input.query);
    return paginatedResponse(result.items, result.pagination);
  }

  @Get(":id")
  @Roles("SUPER_ADMIN", "ADMIN", "STAFF_ORDER")
  async detail(@ValidatedRequest(adminCustomerParamsDto) input: { params: { id: string } }) {
    return successResponse(await this.service.getCustomerDetail(input.params.id));
  }

  @Patch(":id/status")
  @Roles("SUPER_ADMIN", "ADMIN")
  async status(@ValidatedRequest(updateAdminCustomerStatusDto) input: { params: { id: string }; body: UpdateAdminCustomerStatusDto }) {
    return successResponse(await this.service.updateCustomerStatus(input.params.id, input.body), "Cập nhật trạng thái tài khoản thành công.");
  }
}
