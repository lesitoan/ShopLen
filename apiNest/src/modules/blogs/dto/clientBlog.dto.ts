import { z } from "zod";

function parseBooleanQueryValue(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalizedValue = String(Array.isArray(value) ? value[0] : value)
    .trim()
    .toLowerCase();

  if (normalizedValue === "true" || normalizedValue === "1") {
    return true;
  }

  if (normalizedValue === "false" || normalizedValue === "0") {
    return false;
  }

  return value;
}

export const blogPostListQueryDto = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(60).default(5),
    tag: z.string().trim().min(1).max(160).optional(),
    search: z.string().trim().min(1).max(120).optional(),
    home: z
      .preprocess(parseBooleanQueryValue, z.boolean().optional())
      .default(false),
  }),
});

export type BlogPostListQueryDto = z.infer<
  typeof blogPostListQueryDto
>["query"];
