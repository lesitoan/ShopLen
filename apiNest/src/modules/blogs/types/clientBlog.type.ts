import type { BlogPost, BlogTag, BlogPostImage } from "@prisma/client";

export type BlogTagItem = Pick<
  BlogTag,
  "id" | "name" | "slug" | "displayOrder"
>;
export type BlogPostListItem = Pick<
  BlogPost,
  "id" | "slug" | "title" | "excerpt" | "publishedAt" | "readTimeMinutes"
> & {
  tag: Pick<BlogTag, "id" | "name" | "slug">;
  images: Array<Pick<BlogPostImage, "id" | "url" | "altText">>;
};
