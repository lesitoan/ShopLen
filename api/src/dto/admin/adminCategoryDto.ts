import { z } from "zod";

const categorySearchQueryDto = z.preprocess((value) => {
  if (value === undefined) {
    return undefined;
  }

  const search = String(value).trim();
  return search.length > 0 ? search : undefined;
}, z.string().min(1).max(120).optional());

const categoryImageDto = z
  .union([z.string().url(), z.literal(""), z.null()])
  .optional()
  .transform((value) => (value === "" ? null : value));

export const adminCategoryListQueryDto = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: categorySearchQueryDto,
    sort: z.enum(["NEWEST", "OLDEST", "NAME_ASC", "NAME_DESC"]).default("NEWEST"),
  }),
});

export const adminCategoryParamsDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createAdminCategoryDto = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(160),
    slug: z.string().trim().min(1).max(180),
    image: categoryImageDto,
  }),
});

export const updateAdminCategoryDto = z
  .object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      name: z.string().trim().min(1).max(160).optional(),
      slug: z.string().trim().min(1).max(180).optional(),
      image: categoryImageDto,
    }),
  })
  .refine(
    (value) =>
      value.body.name !== undefined ||
      value.body.slug !== undefined ||
      value.body.image !== undefined,
    {
      message: "Vui lòng nhập ít nhất một thông tin cần cập nhật.",
      path: ["body"],
    },
  );

export type AdminCategoryListQueryDto = z.infer<
  typeof adminCategoryListQueryDto
>["query"];

export type CreateAdminCategoryDto = z.infer<
  typeof createAdminCategoryDto
>["body"];

export type UpdateAdminCategoryDto = z.infer<
  typeof updateAdminCategoryDto
>["body"];
