import { ProductOptionType, ProductStatus } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import type { CartProductListDto } from "@/dto/client/cartDto.js";

function formatCartProduct(
  product: Awaited<ReturnType<typeof findCartProducts>>[number],
) {
  const thumbnail = product.images[0] ?? null;
  const price = product.salePrice ?? product.originalPrice;
  const isAvailable =
    product.status === ProductStatus.ACTIVE &&
    product.deletedAt === null &&
    product.stockQuantity > 0;

  return {
    id: product.id,
    code: product.code,
    name: product.name,
    slug: product.slug,
    category: product.category,
    image: thumbnail?.url ?? null,
    imageAlt: thumbnail?.altText ?? null,
    originalPrice: product.originalPrice,
    salePrice: product.salePrice,
    price,
    stockQuantity: product.stockQuantity,
    isAvailable,
    unavailableReason:
      product.status !== ProductStatus.ACTIVE || product.deletedAt !== null
        ? "PRODUCT_UNAVAILABLE"
        : product.stockQuantity <= 0
          ? "OUT_OF_STOCK"
          : null,
    options: product.options,
  };
}

function findCartProducts(ids: string[]) {
  return prisma.product.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      id: true,
      code: true,
      name: true,
      slug: true,
      originalPrice: true,
      salePrice: true,
      stockQuantity: true,
      status: true,
      deletedAt: true,
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
      options: {
        where: {
          optionType: {
            in: [ProductOptionType.COLOR, ProductOptionType.SIZE],
          },
        },
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

export const cartService = {
  async listCartProducts(payload: CartProductListDto) {
    const ids = [...new Set(payload.ids)];
    const products = await findCartProducts(ids);
    const productById = new Map(
      products.map((product) => [product.id, formatCartProduct(product)]),
    );

    return {
      items: ids.map((id) => {
        const product = productById.get(id);

        if (product) {
          return product;
        }

        return {
          id,
          code: null,
          name: null,
          slug: null,
          category: null,
          image: null,
          imageAlt: null,
          originalPrice: null,
          salePrice: null,
          price: 0,
          stockQuantity: 0,
          isAvailable: false,
          unavailableReason: "PRODUCT_NOT_FOUND",
          options: [],
        };
      }),
    };
  },
};
