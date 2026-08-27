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

const statusesQueryDto = z.preprocess(
  parseListQueryValue,
  z.array(z.enum(["ACTIVE", "HIDDEN", "OUT_OF_STOCK"])).optional(),
);

const searchQueryDto = z.preprocess((value) => {
  if (value === undefined) {
    return undefined;
  }

  const search = String(value).trim();
  return search.length > 0 ? search : undefined;
}, z.string().min(1).max(120).optional());

export const adminProductListQueryDto = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: searchQueryDto,
    categoryIds: categoryIdsQueryDto,
    statuses: statusesQueryDto,
    sort: z
      .enum([
        "NEWEST",
        "OLDEST",
        "PRICE_DESC",
        "PRICE_ASC",
        "STOCK_DESC",
        "STOCK_ASC",
      ])
      .default("NEWEST"),
  }),
});

export type AdminProductListQueryDto = z.infer<
  typeof adminProductListQueryDto
>["query"];
