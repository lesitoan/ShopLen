import { Controller, Get, Inject, Patch, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import type { Request, Response } from "express";
import { ClientCustomerService } from "@/modules/customers/services/clientCustomer.service.js";
import { CustomerAuthGuard } from "@/modules/auth/guards/customerAuth.guard.js";
import { CurrentCustomer } from "@/modules/auth/decorators/authActor.decorator.js";
import type { CustomerSession } from "@/modules/auth/types/clientAuth.type.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { successResponse } from "@/common/responses/httpResponse.js";
import { clearRefreshTokenCookie } from "@/modules/auth/http/authCookie.js";
import { AvatarUploadInterceptor } from "@/modules/customers/http/avatarUpload.interceptor.js";
import { updateCustomerProfileDto, changePasswordDto, type UpdateCustomerProfileRequestDto, type ChangePasswordRequestDto } from "@/modules/auth/dto/clientAuth.dto.js";

@Controller("customers")
@UseGuards(CustomerAuthGuard)
export class ClientCustomerController {
  constructor(@Inject(ClientCustomerService) private readonly service: ClientCustomerService) {}

  @Get("me")
  async me(@CurrentCustomer() customer: CustomerSession) {
    return successResponse(await this.service.getMe(customer.id));
  }

  @Patch("me")
  async update(@CurrentCustomer() customer: CustomerSession, @ValidatedRequest(updateCustomerProfileDto) input: { body: UpdateCustomerProfileRequestDto }) {
    return successResponse(await this.service.updateMe(customer.id, input.body), "Cập nhật hồ sơ thành công.");
  }

  @Patch("me/avatar")
  @UseInterceptors(AvatarUploadInterceptor)
  async avatar(@CurrentCustomer() customer: CustomerSession, @Req() request: Request) {
    await this.service.updateAvatar(customer.id, request.file);
    return successResponse(null, "Cập nhật avatar thành công.");
  }

  @Patch("me/password")
  async password(@CurrentCustomer() customer: CustomerSession, @ValidatedRequest(changePasswordDto) input: { body: ChangePasswordRequestDto }, @Res({ passthrough: true }) response: Response) {
    await this.service.changePassword(customer.id, input.body);
    clearRefreshTokenCookie(response, "CUSTOMER");
    return successResponse(null, "Cập nhật mật khẩu thành công.");
  }
}
