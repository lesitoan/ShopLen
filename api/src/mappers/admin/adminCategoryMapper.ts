import type {
  AdminCategoryItem,
  AdminCategoryRecord,
} from "@/types/adminCategory.type.js";

export function toAdminCategoryItem(
  category: AdminCategoryRecord,
): AdminCategoryItem {
  return {
    id: category.id,
    code: category.code,
    name: category.name,
    slug: category.slug,
    image: category.image,
    status: category.status,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
