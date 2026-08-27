import { Prisma } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import type { AdminProductListQueryDto } from "@/dto/admin/adminProductDto.js";
import type { AdminProductListResponse } from "@/types/adminProduct.type.js";

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
        select: {
          id: true,
          code: true,
          name: true,
          slug: true,
          originalPrice: true,
          salePrice: true,
          stockQuantity: true,
          soldCount: true,
          status: true,
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
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: products.map((product) => {
        const thumbnail = product.images[0] ?? null;

        return {
          id: product.id,
          code: product.code,
          name: product.name,
          slug: product.slug,
          category: product.category,
          thumbnail: thumbnail
            ? {
                id: thumbnail.id,
                url: thumbnail.url,
                altText: thumbnail.altText,
              }
            : null,
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
          price: product.salePrice ?? product.originalPrice,
          stockQuantity: product.stockQuantity,
          soldCount: product.soldCount,
          status: product.status,
          createdAt: product.createdAt.toISOString(),
        };
      }),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  },
};
