import { Controller, Inject, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import type { Request } from "express";
import { AdminAuthGuard } from "@/modules/auth/guards/adminAuth.guard.js";
import { RolesGuard } from "@/modules/auth/guards/roles.guard.js";
import { Roles } from "@/modules/auth/decorators/roles.decorator.js";
import { CurrentAdmin } from "@/modules/auth/decorators/authActor.decorator.js";
import type { AdminSession } from "@/modules/auth/types/adminAuth.type.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { createdResponse } from "@/common/responses/httpResponse.js";
import { AdminUploadService } from "@/modules/uploads/services/adminUpload.service.js";
import { AdminSingleImageInterceptor, AdminManyImagesInterceptor } from "@/modules/uploads/http/adminImageUpload.interceptor.js";
import { adminUploadImageQueryDto, type AdminUploadImageQueryDto } from "@/modules/uploads/dto/adminUpload.dto.js";

@Controller("admin/upload")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "ADMIN", "STAFF_CONTENT")
export class AdminUploadController {
  constructor(@Inject(AdminUploadService) private readonly service: AdminUploadService) {}

  @Post("images")
  @UseInterceptors(AdminSingleImageInterceptor)
  async single(@CurrentAdmin() adminUser: AdminSession, @ValidatedRequest(adminUploadImageQueryDto) input: { query: AdminUploadImageQueryDto }, @Req() request: Request) {
    return createdResponse(await this.service.uploadImage({ file: request.file, adminUser, target: input.query.target }), "Tải ảnh lên thành công.");
  }

  @Post("images/many")
  @UseInterceptors(AdminManyImagesInterceptor)
  async many(@CurrentAdmin() adminUser: AdminSession, @ValidatedRequest(adminUploadImageQueryDto) input: { query: AdminUploadImageQueryDto }, @Req() request: Request) {
    const files = Array.isArray(request.files) ? request.files : Object.values(request.files ?? {}).flat();
    return createdResponse(await this.service.uploadManyImages({ files, adminUser, target: input.query.target }), "Tải ảnh lên thành công.");
  }
}
