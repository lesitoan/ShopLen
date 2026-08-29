import { Prisma } from "@prisma/client";
import { v7 as uuidv7 } from "uuid";
import { prisma } from "@/config/prismaClient.js";
import type {
  AdminProductListQueryDto,
  CreateAdminProductDto,
} from "@/dto/admin/adminProductDto.js";
import { toAdminProductListItem } from "@/mappers/admin/adminProductMapper.js";
import type {
  AdminProductListItem,
  AdminProductListResponse,
} from "@/types/adminProduct.type.js";
import { AppError } from "@/utils/appError.js";

export const adminProductService = {
  async listProducts(
    query: AdminProductListQueryDto,
  ): Promise<AdminProductListResponse> {
    const categoryIds = [...new Set(query.categoryIds ?? [])];
    const statuses = [...new Set(query.statuses ?? [])];
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
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
            ],
          }
        : {}),
      ...(categoryIds.length > 0 ? { categoryId: { in: categoryIds } } : {}),
      ...(statuses.length > 0 ? { status: { in: statuses } } : {}),
    };
    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      query.sort === "OLDEST"
        ? [{ createdAt: "asc" }]
        : query.sort === "PRICE_DESC"
          ? [{ salePrice: "desc" }, { originalPrice: "desc" }, { createdAt: "desc" }]
          : query.sort === "PRICE_ASC"
            ? [{ salePrice: "asc" }, { originalPrice: "asc" }, { createdAt: "desc" }]
            : query.sort === "STOCK_DESC"
              ? [{ stockQuantity: "desc" }, { createdAt: "desc" }]
              : query.sort === "STOCK_ASC"
                ? [{ stockQuantity: "asc" }, { createdAt: "desc" }]
                : [{ createdAt: "desc" }];
    const skip = (query.page - 1) * query.limit;

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        select: adminProductListItemSelect,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: products.map(toAdminProductListItem),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  },

  async createProduct(
    payload: CreateAdminProductDto,
  ): Promise<AdminProductListItem> {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
      select: { id: true },
    });

    if (!category) {
      throw new AppError("Không tìm thấy danh mục.", 404, "CATEGORY_NOT_FOUND");
    }

    const thumbnailIndex = payload.images.findIndex((image) => image.isThumbnail);
    const fallbackThumbnailIndex = thumbnailIndex >= 0 ? thumbnailIndex : 0;

    try {
      const product = await prisma.product.create({
        data: {
          code: payload.code || `SP${uuidv7().replaceAll("-", "").slice(0, 28)}`,
          name: payload.name,
          slug: payload.slug,
          categoryId: payload.categoryId,
          shortDescription: payload.shortDescription,
          descriptionHtml: payload.descriptionHtml,
          careInstructionHtml: payload.careInstructionHtml,
          originalPrice: payload.originalPrice,
          salePrice: payload.salePrice,
          stockQuantity: payload.stockQuantity,
          status: payload.status,
          highlightType: payload.highlightType,
          metaTitle: payload.metaTitle,
          metaDescription: payload.metaDescription,
          images: {
            create: payload.images.map((image, index) => ({
              url: image.url,
              publicId: image.publicId,
              altText: image.altText,
              displayOrder: image.displayOrder ?? index,
              isThumbnail: index === fallbackThumbnailIndex,
            })),
          },
          ...(payload.options?.length
            ? {
                options: {
                  create: payload.options.map((option, index) => ({
                    optionType: option.optionType,
                    name: option.name,
                    displayOrder: option.displayOrder ?? index,
                    values: option.values,
                  })),
                },
              }
            : {}),
        },
        select: adminProductListItemSelect,
      });

      return toAdminProductListItem(product);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Slug hoặc mã sản phẩm đã tồn tại.",
          409,
          "PRODUCT_ALREADY_EXISTS",
        );
      }

      throw error;
    }
  },
};

const adminProductListItemSelect = {
  id: true,
  code: true,
  name: true,
  slug: true,
  originalPrice: true,
  salePrice: true,
  stockQuantity: true,
  soldCount: true,
  status: true,
  highlightType: true,
  createdAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  images: {
    where: { isThumbnail: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    take: 1,
    select: {
      id: true,
      url: true,
      altText: true,
    },
  },
} satisfies Prisma.ProductSelect;
