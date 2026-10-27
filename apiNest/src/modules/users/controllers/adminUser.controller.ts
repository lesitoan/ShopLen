import {
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AdminAuthGuard } from "@/modules/auth/guards/adminAuth.guard.js";
import { RolesGuard } from "@/modules/auth/guards/roles.guard.js";
import { Roles } from "@/modules/auth/decorators/roles.decorator.js";
import { CurrentAdmin } from "@/modules/auth/decorators/authActor.decorator.js";
import type { AdminSession } from "@/modules/auth/types/adminAuth.type.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import {
  createdResponse,
  paginatedResponse,
  successResponse,
} from "@/common/responses/httpResponse.js";
import { AdminUserService } from "@/modules/users/services/adminUser.service.js";
import {
  adminUserListQueryDto,
  adminUserParamsDto,
  createAdminUserDto,
  updateAdminUserDto,
  updateAdminUserPasswordDto,
  type AdminUserListQueryDto,
  type CreateAdminUserDto,
  type UpdateAdminUserDto,
  type UpdateAdminUserPasswordDto,
} from "@/modules/users/dto/adminUser.dto.js";

@Controller("admin/users")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "ADMIN")
export class AdminUserController {
  constructor(
    @Inject(AdminUserService) private readonly service: AdminUserService,
  ) {}

  @Get()
  async list(
    @ValidatedRequest(adminUserListQueryDto)
    input: {
      query: AdminUserListQueryDto;
    },
  ) {
    const result = await this.service.listUsers(input.query);
    return paginatedResponse(result.items, result.pagination);
  }

  @Get(":id")
  async detail(
    @CurrentAdmin() actor: AdminSession,
    @ValidatedRequest(adminUserParamsDto) input: { params: { id: string } },
  ) {
    return successResponse(
      await this.service.getUserDetail(input.params.id, actor),
    );
  }

  @Post()
  async create(
    @CurrentAdmin() actor: AdminSession,
    @ValidatedRequest(createAdminUserDto) input: { body: CreateAdminUserDto },
  ) {
    return createdResponse(
      await this.service.createUser(input.body, actor),
      "Tạo nhân viên thành công.",
    );
  }

  @Patch(":id")
  async update(
    @CurrentAdmin() actor: AdminSession,
    @ValidatedRequest(updateAdminUserDto)
    input: { params: { id: string }; body: UpdateAdminUserDto },
  ) {
    return successResponse(
      await this.service.updateUser(input.params.id, input.body, actor),
      "Cập nhật nhân viên thành công.",
    );
  }

  @Patch(":id/password")
  async password(
    @CurrentAdmin() actor: AdminSession,
    @ValidatedRequest(updateAdminUserPasswordDto)
    input: { params: { id: string }; body: UpdateAdminUserPasswordDto },
  ) {
    await this.service.updateUserPassword(input.params.id, input.body, actor);
    return successResponse(undefined, "Cập nhật mật khẩu thành công.");
  }

  @Delete(":id")
  async delete(
    @CurrentAdmin() actor: AdminSession,
    @ValidatedRequest(adminUserParamsDto) input: { params: { id: string } },
  ) {
    await this.service.deleteUser(input.params.id, actor);
    return successResponse(undefined, "Xóa nhân viên thành công.");
  }
}
