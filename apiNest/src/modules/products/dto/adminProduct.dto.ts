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

const nullableTextDto = (max: number) =>
  z
    .union([z.string().trim().max(max), z.literal(""), z.null()])
    .optional()
    .transform((value) => (value === "" ? null : value));

const productImageDto = z.object({
  url: z.string().url(),
  publicId: nullableTextDto(255),
  altText: nullableTextDto(255),
  displayOrder: z.number().int().min(0).optional(),
  isThumbnail: z.boolean().optional(),
});

const productImageInputDto = z.union([
  z.string().url().transform((url) => ({
    url,
    publicId: null,
    altText: null,
    displayOrder: undefined,
    isThumbnail: undefined,
  })),
  productImageDto,
]);

const productOptionValueDto = z.object({
  code: z.string().trim().min(1).max(60),
  label: z.string().trim().min(1).max(120),
  colorHex: z
    .union([z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/), z.literal(""), z.null()])
    .optional()
    .transform((value) => (value === "" ? null : value)),
  priceDiff: z.number().int().optional(),
  isDefault: z.boolean().optional(),
});

const productOptionDto = z.object({
  optionType: z.enum(["COLOR", "SIZE"]),
  name: z.string().trim().min(1).max(120),
  displayOrder: z.number().int().min(0).optional(),
  values: z.array(productOptionValueDto).min(1),
});

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

export const createAdminProductDto = z
  .object({
    body: z.object({
      code: z.string().trim().min(1).max(30).optional(),
      name: z.string().trim().min(1).max(180),
      slug: z.string().trim().min(1).max(220),
      categoryId: z.string().uuid(),
      shortDescription: nullableTextDto(500),
      descriptionHtml: nullableTextDto(20000),
      careInstructionHtml: nullableTextDto(20000),
      originalPrice: z.number().int().min(0),
      salePrice: z.number().int().min(0).nullable().optional(),
      stockQuantity: z.number().int().min(0).default(0),
      status: z.enum(["ACTIVE", "HIDDEN", "OUT_OF_STOCK"]).default("ACTIVE"),
      highlightType: z
        .enum(["HOT_PRODUCT", "TODAY_DEAL", "HOT_TIKTOK"])
        .nullable()
        .optional(),
      metaTitle: nullableTextDto(180),
      metaDescription: nullableTextDto(300),
      images: z.array(productImageInputDto).min(1),
      options: z.array(productOptionDto).max(2).optional(),
    }),
  })
  .refine(
    (value) =>
      value.body.salePrice === null ||
      value.body.salePrice === undefined ||
      value.body.salePrice <= value.body.originalPrice,
    {
      message: "Giá khuyến mãi không được lớn hơn giá gốc.",
      path: ["body", "salePrice"],
    },
  )
  .refine(
    (value) => {
      const optionTypes = value.body.options?.map((option) => option.optionType) ?? [];
      return optionTypes.length === new Set(optionTypes).size;
    },
    {
      message: "Mỗi loại tùy chọn chỉ được khai báo một lần.",
      path: ["body", "options"],
    },
  );

export const adminProductParamsDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateAdminProductDto = z
  .object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      name: z.string().trim().min(1).max(180).optional(),
      slug: z.string().trim().min(1).max(220).optional(),
      categoryId: z.string().uuid().optional(),
      shortDescription: nullableTextDto(500),
      descriptionHtml: nullableTextDto(20000),
      careInstructionHtml: nullableTextDto(20000),
      originalPrice: z.number().int().min(0).optional(),
      salePrice: z.number().int().min(0).nullable().optional(),
      stockQuantity: z.number().int().min(0).optional(),
      status: z.enum(["ACTIVE", "HIDDEN", "OUT_OF_STOCK"]).optional(),
      highlightType: z
        .enum(["HOT_PRODUCT", "TODAY_DEAL", "HOT_TIKTOK"])
        .nullable()
        .optional(),
      metaTitle: nullableTextDto(180),
      metaDescription: nullableTextDto(300),
      images: z.array(productImageInputDto).min(1).optional(),
      options: z.array(productOptionDto).max(2).optional(),
    }),
  })
  .refine(
    (value) =>
      Object.values(value.body).some((fieldValue) => fieldValue !== undefined),
    {
      message: "Vui lòng nhập ít nhất một thông tin cần cập nhật.",
      path: ["body"],
    },
  )
  .refine(
    (value) =>
      value.body.originalPrice === undefined ||
      value.body.salePrice === undefined ||
      value.body.salePrice === null ||
      value.body.salePrice <= value.body.originalPrice,
    {
      message: "Giá khuyến mãi không được lớn hơn giá gốc.",
      path: ["body", "salePrice"],
    },
  )
  .refine(
    (value) => {
      const optionTypes = value.body.options?.map((option) => option.optionType) ?? [];
      return optionTypes.length === new Set(optionTypes).size;
    },
    {
      message: "Mỗi loại tùy chọn chỉ được khai báo một lần.",
      path: ["body", "options"],
    },
  );

export type AdminProductListQueryDto = z.infer<
  typeof adminProductListQueryDto
>["query"];

export type CreateAdminProductDto = z.infer<
  typeof createAdminProductDto
>["body"];

export type UpdateAdminProductDto = z.infer<
  typeof updateAdminProductDto
>["body"];
