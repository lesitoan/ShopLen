import { z } from "zod";

export const productListQueryDto = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(60).default(12),
      sort: z
        .enum(["NEWEST", "PRICE_ASC", "PRICE_DESC", "BEST_SELLING"])
        .default("NEWEST"),
      categoryId: z.string().uuid().optional(),
      categorySlug: z.string().trim().min(1).max(180).optional(),
      search: z.string().trim().min(1).max(120).optional(),
      highlightType: z
        .enum(["HOT_PRODUCT", "TODAY_DEAL", "HOT_TIKTOK"])
        .optional(),
      minPrice: z.coerce.number().int().min(0).optional(),
      maxPrice: z.coerce.number().int().min(0).optional(),
    })
    .refine(
      (value) =>
        value.minPrice === undefined ||
        value.maxPrice === undefined ||
        value.minPrice <= value.maxPrice,
      {
        message: "minPrice phải nhỏ hơn hoặc bằng maxPrice.",
        path: ["maxPrice"],
      },
    ),
});

export type ProductListQueryDto = z.infer<
  typeof productListQueryDto
>["query"];
