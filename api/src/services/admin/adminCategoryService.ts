import { Prisma } from "@prisma/client";
import { v7 as uuidv7 } from "uuid";
import { prisma } from "@/config/prismaClient.js";
import type {
  AdminCategoryListQueryDto,
  CreateAdminCategoryDto,
  UpdateAdminCategoryDto,
} from "@/dto/admin/adminCategoryDto.js";
import { toAdminCategoryItem } from "@/mappers/admin/adminCategoryMapper.js";
import type {
  AdminCategoryItem,
  AdminCategoryListResponse,
} from "@/types/adminCategory.type.js";
import { AppError } from "@/utils/appError.js";

export const adminCategoryService = {
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

    const [categories, total] = await prisma.$transaction([
      prisma.category.findMany({
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
      prisma.category.count({ where }),
    ]);

    return {
      items: categories.map(toAdminCategoryItem),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  },

  async getCategoryDetail(id: string): Promise<AdminCategoryItem> {
    const category = await prisma.category.findUnique({
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
  },

  async createCategory(payload: CreateAdminCategoryDto) {
    try {
      await prisma.category.create({
        data: {
          code: uuidv7().replaceAll("-", "").slice(0, 30),
          name: payload.name,
          slug: payload.slug,
          image: payload.image,
        },
      });
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
  },

  async updateCategory(id: string, payload: UpdateAdminCategoryDto) {
    try {
      await prisma.category.update({
        where: { id },
        data: {
          name: payload.name,
          slug: payload.slug,
          image: payload.image,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Không tìm thấy danh mục.", 404, "CATEGORY_NOT_FOUND");
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
  },

  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!category) {
      throw new AppError("Không tìm thấy danh mục.", 404, "CATEGORY_NOT_FOUND");
    }

    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new AppError(
        "Vui lòng xóa các sản phẩm thuộc danh mục này trước khi xóa danh mục.",
        409,
        "CATEGORY_HAS_PRODUCTS",
      );
    }

    await prisma.category.delete({ where: { id } });
  },
};
