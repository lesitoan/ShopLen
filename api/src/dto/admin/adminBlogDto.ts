import { z } from "zod";

const blogSearchQueryDto = z.preprocess((value) => {
  if (value === undefined) {
    return undefined;
  }

  const search = String(value).trim();
  return search.length > 0 ? search : undefined;
}, z.string().min(1).max(120).optional());

export const adminBlogPostListQueryDto = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: blogSearchQueryDto,
    status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).optional(),
    tagId: z.string().uuid().optional(),
    sort: z.enum(["NEWEST", "OLDEST", "VIEWS_DESC", "TITLE_ASC"]).default("NEWEST"),
  }),
});

export const adminBlogPostParamsDto = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const createAdminBlogPostDto = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(220),
    slug: z.string().trim().min(1).max(220),
    excerpt: z.string().trim().min(1).max(500),
    contentHtml: z.string().min(1),
    tagId: z.string().min(1).optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).default("DRAFT"),
    isFeatured: z.boolean().default(false),
    showOnHome: z.boolean().default(false),
    readTimeMinutes: z.coerce.number().int().min(1).default(1),
    publishedAt: z
      .preprocess((val) => {
        if (!val || val === "") return null;
        return val;
      }, z.string().datetime().nullable().optional()),
    metaTitle: z.string().trim().max(180).nullable().optional(),
    metaDescription: z.string().trim().max(300).nullable().optional(),
    thumbnailUrl: z
      .union([z.string().url(), z.literal(""), z.null()])
      .optional(),
    images: z
      .array(
        z.object({
          url: z.string().url(),
          altText: z.string().max(255).optional(),
          isThumbnail: z.boolean().optional(),
          displayOrder: z.number().int().optional(),
        })
      )
      .optional(),
  }),
});

export const updateAdminBlogPostDto = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: createAdminBlogPostDto.shape.body.partial(),
});

export const updateAdminBlogPostStatusDto = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]),
  }),
});

export const createAdminBlogTagDto = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100),
    slug: z.string().trim().max(120).optional(),
  }),
});

export const updateAdminBlogTagDto = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().trim().min(1).max(100).optional(),
    slug: z.string().trim().max(120).optional(),
  }),
});

export type AdminBlogPostListQueryDto = z.infer<
  typeof adminBlogPostListQueryDto
>["query"];

export type CreateAdminBlogPostDto = z.infer<
  typeof createAdminBlogPostDto
>["body"];

export type UpdateAdminBlogPostDto = z.infer<
  typeof updateAdminBlogPostDto
>["body"];
