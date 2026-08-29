import type {
  AdminProductListItem,
  AdminProductRecord,
} from "@/types/adminProduct.type.js";

export function toAdminProductListItem(
  product: AdminProductRecord,
): AdminProductListItem {
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
    highlightType: product.highlightType,
    createdAt: product.createdAt.toISOString(),
  };
}
