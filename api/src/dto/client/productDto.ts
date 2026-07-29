import { z } from "zod";

function parseListQueryValue(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  const rawValues = Array.isArray(value) ? value : [value];

  return rawValues
    .flatMap((item) => String(item).split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

const categoryIdsQueryDto = z.preprocess(
  parseListQueryValue,
  z.array(z.string().uuid()).optional(),
);

const colorCodesQueryDto = z.preprocess(
  parseListQueryValue,
  z
    .array(
      z
        .string()
        .trim()
        .transform((value) => value.toUpperCase())
        .pipe(z.string().regex(/^[A-Z0-9_]+$/)),
    )
    .optional(),
);

export const productListQueryDto = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(60).default(12),
      sort: z
        .enum(["NEWEST", "PRICE_ASC", "PRICE_DESC", "BEST_SELLING"])
        .default("NEWEST"),
      categoryIds: categoryIdsQueryDto,
      search: z.string().trim().min(1).max(120).optional(),
      colorCodes: colorCodesQueryDto,
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

export const productSlugParamDto = z.object({
  params: z.object({
    slug: z.string().trim().min(1).max(220),
  }),
});

export type ProductListQueryDto = z.infer<
  typeof productListQueryDto
>["query"];
