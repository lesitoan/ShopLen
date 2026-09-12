import type { ProductListQueryDto } from "@/dto/client/productDto.js";

export type ProductSort = ProductListQueryDto["sort"];

export const HOME_PRODUCT_SECTION_TYPES = [
  "BEST_SELLING",
  "TODAY_DEAL",
  "HOT_PRODUCT",
  "HOT_TIKTOK",
] as const;

export type HomeProductSectionType =
  (typeof HOME_PRODUCT_SECTION_TYPES)[number];
