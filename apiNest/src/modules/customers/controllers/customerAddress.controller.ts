import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CustomerAddressService } from "@/modules/customers/services/customerAddress.service.js";
import { CustomerAuthGuard } from "@/modules/auth/guards/customerAuth.guard.js";
import { CurrentCustomer } from "@/modules/auth/decorators/authActor.decorator.js";
import type { CustomerSession } from "@/modules/auth/types/clientAuth.type.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { successResponse } from "@/common/responses/httpResponse.js";
import {
  createCustomerAddressDto,
  updateCustomerAddressDto,
  deleteCustomerAddressDto,
  type CreateCustomerAddressRequestDto,
  type UpdateCustomerAddressRequestDto,
} from "@/modules/customers/dto/customerAddress.dto.js";

@Controller("addresses")
@UseGuards(CustomerAuthGuard)
export class CustomerAddressController {
  constructor(
    @Inject(CustomerAddressService)
    private readonly service: CustomerAddressService,
  ) {}

  @Get()
  async list(@CurrentCustomer() customer: CustomerSession) {
    return successResponse(await this.service.listAddresses(customer.id));
  }

  @Post()
  @HttpCode(200)
  async create(
    @CurrentCustomer() customer: CustomerSession,
    @ValidatedRequest(createCustomerAddressDto)
    input: { body: CreateCustomerAddressRequestDto },
  ) {
    await this.service.createAddress(customer.id, input.body);
    return successResponse(null, "Thêm địa chỉ thành công.");
  }

  @Patch(":id")
  async update(
    @CurrentCustomer() customer: CustomerSession,
    @ValidatedRequest(updateCustomerAddressDto)
    input: { params: { id: string }; body: UpdateCustomerAddressRequestDto },
  ) {
    await this.service.updateAddress(customer.id, input.params.id, input.body);
    return successResponse(null, "Cập nhật địa chỉ thành công.");
  }

  @Delete(":id")
  async delete(
    @CurrentCustomer() customer: CustomerSession,
    @ValidatedRequest(deleteCustomerAddressDto)
    input: { params: { id: string } },
  ) {
    await this.service.deleteAddress(customer.id, input.params.id);
    return successResponse(null, "Xóa địa chỉ thành công.");
  }
}
