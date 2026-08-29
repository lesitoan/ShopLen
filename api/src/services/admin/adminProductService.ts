import { Prisma } from "@prisma/client";
import { v7 as uuidv7 } from "uuid";
import { prisma } from "@/config/prismaClient.js";
import type {
  AdminProductListQueryDto,
  CreateAdminProductDto,
  UpdateAdminProductDto,
} from "@/dto/admin/adminProductDto.js";
import {
  toAdminProductDetail,
  toAdminProductListItem,
} from "@/mappers/admin/adminProductMapper.js";
import type {
  AdminProductDetail,
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
    await ensureCategoryExists(payload.categoryId);

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

  async getProductDetail(id: string): Promise<AdminProductDetail> {
    const product = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: adminProductDetailSelect,
    });

    if (!product) {
      throw new AppError("Không tìm thấy sản phẩm.", 404, "PRODUCT_NOT_FOUND");
    }

    return toAdminProductDetail(product);
  },

  async updateProduct(
    id: string,
    payload: UpdateAdminProductDto,
  ): Promise<AdminProductDetail> {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        originalPrice: true,
        salePrice: true,
      },
    });

    if (!existingProduct) {
      throw new AppError("Không tìm thấy sản phẩm.", 404, "PRODUCT_NOT_FOUND");
    }

    if (payload.categoryId) {
      await ensureCategoryExists(payload.categoryId);
    }

    const nextOriginalPrice = payload.originalPrice ?? existingProduct.originalPrice;
    const nextSalePrice =
      payload.salePrice === undefined ? existingProduct.salePrice : payload.salePrice;

    if (nextSalePrice !== null && nextSalePrice > nextOriginalPrice) {
      throw new AppError(
        "Giá khuyến mãi không được lớn hơn giá gốc.",
        422,
        "VALIDATION_ERROR",
      );
    }

    const thumbnailIndex = payload.images?.findIndex((image) => image.isThumbnail) ?? -1;
    const fallbackThumbnailIndex = thumbnailIndex >= 0 ? thumbnailIndex : 0;

    try {
      const product = await prisma.$transaction(async (transaction) => {
        if (payload.images) {
          await transaction.productImage.deleteMany({
            where: { productId: id },
          });
        }

        if (payload.options) {
          await transaction.productOption.deleteMany({
            where: { productId: id },
          });
        }

        return transaction.product.update({
          where: { id },
          data: {
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
            ...(payload.images
              ? {
                  images: {
                    create: payload.images.map((image, index) => ({
                      url: image.url,
                      publicId: image.publicId,
                      altText: image.altText,
                      displayOrder: image.displayOrder ?? index,
                      isThumbnail: index === fallbackThumbnailIndex,
                    })),
                  },
                }
              : {}),
            ...(payload.options
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
          select: adminProductDetailSelect,
        });
      });

      return toAdminProductDetail(product);
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

  async deleteProduct(id: string): Promise<void> {
    const existing = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!existing) {
      throw new AppError("Không tìm thấy sản phẩm.", 404, "PRODUCT_NOT_FOUND");
    }

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
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

const adminProductDetailSelect = {
  id: true,
  code: true,
  name: true,
  slug: true,
  shortDescription: true,
  descriptionHtml: true,
  careInstructionHtml: true,
  originalPrice: true,
  salePrice: true,
  stockQuantity: true,
  soldCount: true,
  status: true,
  highlightType: true,
  metaTitle: true,
  metaDescription: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  images: {
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      url: true,
      publicId: true,
      altText: true,
      displayOrder: true,
      isThumbnail: true,
    },
  },
  options: {
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      optionType: true,
      name: true,
      displayOrder: true,
      values: true,
    },
  },
} satisfies Prisma.ProductSelect;

async function ensureCategoryExists(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new AppError("Không tìm thấy danh mục.", 404, "CATEGORY_NOT_FOUND");
  }
}
