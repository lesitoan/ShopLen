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
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import {
  createdResponse,
  paginatedResponse,
  successResponse,
} from "@/common/responses/httpResponse.js";
import { AdminCategoryService } from "@/modules/categories/services/adminCategory.service.js";
import {
  adminCategoryListQueryDto,
  adminCategoryParamsDto,
  createAdminCategoryDto,
  updateAdminCategoryDto,
  type AdminCategoryListQueryDto,
  type CreateAdminCategoryDto,
  type UpdateAdminCategoryDto,
} from "@/modules/categories/dto/adminCategory.dto.js";

@Controller("admin/categories")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "ADMIN")
export class AdminCategoryController {
  constructor(
    @Inject(AdminCategoryService)
    private readonly service: AdminCategoryService,
  ) {}

  @Get()
  async list(
    @ValidatedRequest(adminCategoryListQueryDto)
    input: {
      query: AdminCategoryListQueryDto;
    },
  ) {
    const result = await this.service.listCategories(input.query);
    return paginatedResponse(result.items, result.pagination);
  }

  @Get(":id")
  async detail(
    @ValidatedRequest(adminCategoryParamsDto) input: { params: { id: string } },
  ) {
    return successResponse(
      await this.service.getCategoryDetail(input.params.id),
    );
  }

  @Post()
  async create(
    @ValidatedRequest(createAdminCategoryDto)
    input: {
      body: CreateAdminCategoryDto;
    },
  ) {
    await this.service.createCategory(input.body);
    return createdResponse(undefined, "Tạo danh mục thành công.");
  }

  @Patch(":id")
  async update(
    @ValidatedRequest(updateAdminCategoryDto)
    input: {
      params: { id: string };
      body: UpdateAdminCategoryDto;
    },
  ) {
    await this.service.updateCategory(input.params.id, input.body);
    return successResponse(undefined, "Cập nhật danh mục thành công.");
  }

  @Delete(":id")
  async delete(
    @ValidatedRequest(adminCategoryParamsDto) input: { params: { id: string } },
  ) {
    await this.service.deleteCategory(input.params.id);
    return successResponse(undefined, "Xóa danh mục thành công.");
  }
}
