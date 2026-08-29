import type {
  AdminProductDetail,
  AdminProductDetailRecord,
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

export function toAdminProductDetail(
  product: AdminProductDetailRecord,
): AdminProductDetail {
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    descriptionHtml: product.descriptionHtml,
    careInstructionHtml: product.careInstructionHtml,
    category: product.category,
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      publicId: image.publicId,
      altText: image.altText,
      displayOrder: image.displayOrder,
      isThumbnail: image.isThumbnail,
    })),
    options: product.options.map((option) => ({
      id: option.id,
      optionType: option.optionType,
      name: option.name,
      displayOrder: option.displayOrder,
      values: option.values,
    })),
    originalPrice: product.originalPrice,
    salePrice: product.salePrice,
    price: product.salePrice ?? product.originalPrice,
    stockQuantity: product.stockQuantity,
    soldCount: product.soldCount,
    status: product.status,
    highlightType: product.highlightType,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
