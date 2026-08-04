import { Prisma, ProductOptionType } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import type { ProductListQueryDto } from "@/dto/client/productDto.js";
import type { ProductSort } from "@/types/product.type.js";
import { AppError } from "@/utils/appError.js";

function getOrderBy(sort: ProductSort): Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "PRICE_ASC") {
    return [{ salePrice: "asc" }, { originalPrice: "asc" }, { createdAt: "desc" }];
  }

  if (sort === "PRICE_DESC") {
    return [{ salePrice: "desc" }, { originalPrice: "desc" }, { createdAt: "desc" }];
  }

  if (sort === "BEST_SELLING") {
    return [{ soldCount: "desc" }, { createdAt: "desc" }];
  }

  return [{ createdAt: "desc" }];
}

function getPriceFilter(
  minPrice?: number,
  maxPrice?: number,
): Prisma.ProductWhereInput | undefined {
  if (minPrice === undefined && maxPrice === undefined) {
    return undefined;
  }

  const salePriceRange: Prisma.IntNullableFilter = { not: null };
  const originalPriceRange: Prisma.IntFilter = {};

  if (minPrice !== undefined) {
    salePriceRange.gte = minPrice;
    originalPriceRange.gte = minPrice;
  }

  if (maxPrice !== undefined) {
    salePriceRange.lte = maxPrice;
    originalPriceRange.lte = maxPrice;
  }

  return {
    OR: [
      { salePrice: salePriceRange },
      {
        salePrice: null,
        originalPrice: originalPriceRange,
      },
    ],
  };
}

function formatProductListItem(
  product: Awaited<ReturnType<typeof findProducts>>[number],
) {
  const thumbnail = product.images[0] ?? null;

  return {
    id: product.id,
    code: product.code,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
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
    highlightType: product.highlightType,
  };
}

function formatProductDetail(
  product: NonNullable<Awaited<ReturnType<typeof findProductBySlug>>>,
) {
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    descriptionHtml: product.descriptionHtml,
    careInstructionHtml: product.careInstructionHtml,
    category: product.category,
    images: product.images,
    options: product.options,
    originalPrice: product.originalPrice,
    salePrice: product.salePrice,
    price: product.salePrice ?? product.originalPrice,
    stockQuantity: product.stockQuantity,
    soldCount: product.soldCount,
    highlightType: product.highlightType,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
  };
}

function buildWhere(query: ProductListQueryDto): Prisma.ProductWhereInput {
  const andFilters: Prisma.ProductWhereInput[] = [
    {
      status: "ACTIVE",
      deletedAt: null,
    },
  ];
  const categoryIds = query.categoryIds ?? [];

  if (categoryIds.length > 0) {
    andFilters.push({ categoryId: { in: [...new Set(categoryIds)] } });
  }

  if (query.search) {
    andFilters.push({
      OR: [
        { name: { contains: query.search, mode: "insensitive" } },
        { code: { contains: query.search, mode: "insensitive" } },
        { shortDescription: { contains: query.search, mode: "insensitive" } },
      ],
    });
  }

  if (query.colorCodes && query.colorCodes.length > 0) {
    const colorCodes = [...new Set(query.colorCodes)];

    andFilters.push({
      options: {
        some: {
          optionType: ProductOptionType.COLOR,
          OR: colorCodes.map((colorCode) => ({
            values: {
              array_contains: [{ code: colorCode }],
            },
          })),
        },
      },
    });
  }

  if (query.highlightType) {
    andFilters.push({ highlightType: query.highlightType });
  }

  const priceFilter = getPriceFilter(query.minPrice, query.maxPrice);

  if (priceFilter) {
    andFilters.push(priceFilter);
  }

  return { AND: andFilters };
}

function findProducts(args: {
  where: Prisma.ProductWhereInput;
  orderBy: Prisma.ProductOrderByWithRelationInput[];
  skip: number;
  take: number;
}) {
  return prisma.product.findMany({
    where: args.where,
    orderBy: args.orderBy,
    skip: args.skip,
    take: args.take,
    select: {
      id: true,
      code: true,
      name: true,
      slug: true,
      shortDescription: true,
      originalPrice: true,
      salePrice: true,
      stockQuantity: true,
      soldCount: true,
      highlightType: true,
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
  });
}

function findProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      status: "ACTIVE",
      deletedAt: null,
    },
    select: {
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
      highlightType: true,
      metaTitle: true,
      metaDescription: true,
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
    },
  });
}

export const productService = {
  async listProducts(query: ProductListQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const where = buildWhere(query);

    const [totalItems, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      findProducts({
        where,
        orderBy: getOrderBy(query.sort),
        skip,
        take: limit,
      }),
    ]);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: products.map(formatProductListItem),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  },

  async getProductDetailBySlug(slug: string) {
    const product = await findProductBySlug(slug);

    if (!product) {
      throw new AppError(
        "Sản phẩm không tồn tại.",
        404,
        "PRODUCT_NOT_FOUND",
      );
    }

    return formatProductDetail(product);
  },
};
