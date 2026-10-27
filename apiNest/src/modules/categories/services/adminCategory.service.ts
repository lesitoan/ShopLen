import { Prisma } from "@prisma/client";
import { v7 as uuidv7 } from "uuid";
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { CategoryCacheService } from "@/modules/categories/services/categoryCache.service.js";
import type {
  AdminCategoryListQueryDto,
  CreateAdminCategoryDto,
  UpdateAdminCategoryDto,
} from "@/modules/categories/dto/adminCategory.dto.js";
import { toAdminCategoryItem } from "@/modules/categories/mappers/adminCategoryMapper.js";
import type {
  AdminCategoryItem,
  AdminCategoryListResponse,
} from "@/modules/categories/types/adminCategory.type.js";
import { AppError } from "@/common/errors/appError.js";

@Injectable()
export class AdminCategoryService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(CategoryCacheService) private readonly cache: CategoryCacheService,
  ) {}
  async listCategories(
    query: AdminCategoryListQueryDto,
  ): Promise<AdminCategoryListResponse> {
    const where: Prisma.CategoryWhereInput = {
      ...(query.search
        ? {
            OR: [
              {
                name: {
                  contains: query.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                code: {
                  contains: query.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                slug: {
                  contains: query.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };
    const orderBy: Prisma.CategoryOrderByWithRelationInput[] =
      query.sort === "OLDEST"
        ? [{ createdAt: "asc" }]
        : query.sort === "NAME_ASC"
          ? [{ name: "asc" }, { createdAt: "desc" }]
          : query.sort === "NAME_DESC"
            ? [{ name: "desc" }, { createdAt: "desc" }]
            : [{ createdAt: "desc" }];
    const skip = (query.page - 1) * query.limit;

    const [categories, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        select: {
          id: true,
          code: true,
          name: true,
          slug: true,
          image: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      items: categories.map(toAdminCategoryItem),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  async getCategoryDetail(id: string): Promise<AdminCategoryItem> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        slug: true,
        image: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!category) {
      throw new AppError("Không tìm thấy danh mục.", 404, "CATEGORY_NOT_FOUND");
    }

    return toAdminCategoryItem(category);
  }

  async createCategory(payload: CreateAdminCategoryDto) {
    try {
      await this.prisma.category.create({
        data: {
          code: uuidv7().replaceAll("-", "").slice(0, 30),
          name: payload.name,
          slug: payload.slug,
          image: payload.image,
        },
      });
      await this.cache.invalidateCategoryCache();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Tên hoặc slug danh mục đã tồn tại.",
          409,
          "CATEGORY_ALREADY_EXISTS",
        );
      }

      throw error;
    }
  }

  async updateCategory(id: string, payload: UpdateAdminCategoryDto) {
    try {
      await this.prisma.category.update({
        where: { id },
        data: {
          name: payload.name,
          slug: payload.slug,
          image: payload.image,
        },
      });
      await this.cache.invalidateCategoryCache();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError(
          "Không tìm thấy danh mục.",
          404,
          "CATEGORY_NOT_FOUND",
        );
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Tên hoặc slug danh mục đã tồn tại.",
          409,
          "CATEGORY_ALREADY_EXISTS",
        );
      }

      throw error;
    }
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!category) {
      throw new AppError("Không tìm thấy danh mục.", 404, "CATEGORY_NOT_FOUND");
    }

    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new AppError(
        "Vui lòng xóa các sản phẩm thuộc danh mục này trước khi xóa danh mục.",
        409,
        "CATEGORY_HAS_PRODUCTS",
      );
    }

    await this.prisma.category.delete({ where: { id } });
    await this.cache.invalidateCategoryCache();
  }
}
