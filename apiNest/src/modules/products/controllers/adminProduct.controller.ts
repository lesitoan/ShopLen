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
import { AdminProductService } from "@/modules/products/services/adminProduct.service.js";
import {
  adminProductListQueryDto,
  adminProductParamsDto,
  createAdminProductDto,
  updateAdminProductDto,
  type AdminProductListQueryDto,
  type CreateAdminProductDto,
  type UpdateAdminProductDto,
} from "@/modules/products/dto/adminProduct.dto.js";

@Controller("admin/products")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "ADMIN")
export class AdminProductController {
  constructor(
    @Inject(AdminProductService) private readonly service: AdminProductService,
  ) {}

  @Get()
  async list(
    @ValidatedRequest(adminProductListQueryDto)
    input: {
      query: AdminProductListQueryDto;
    },
  ) {
    const result = await this.service.listProducts(input.query);
    return paginatedResponse(result.items, result.pagination);
  }

  @Post()
  async create(
    @ValidatedRequest(createAdminProductDto)
    input: {
      body: CreateAdminProductDto;
    },
  ) {
    return createdResponse(
      await this.service.createProduct(input.body),
      "Tạo sản phẩm thành công.",
    );
  }

  @Get(":id")
  async detail(
    @ValidatedRequest(adminProductParamsDto) input: { params: { id: string } },
  ) {
    return successResponse(
      await this.service.getProductDetail(input.params.id),
    );
  }

  @Patch(":id")
  async update(
    @ValidatedRequest(updateAdminProductDto)
    input: {
      params: { id: string };
      body: UpdateAdminProductDto;
    },
  ) {
    return successResponse(
      await this.service.updateProduct(input.params.id, input.body),
      "Cập nhật sản phẩm thành công.",
    );
  }

  @Delete(":id")
  async delete(
    @ValidatedRequest(adminProductParamsDto) input: { params: { id: string } },
  ) {
    await this.service.deleteProduct(input.params.id);
    return successResponse(undefined, "Xóa sản phẩm thành công.");
  }
}
