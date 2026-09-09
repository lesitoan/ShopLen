export type BlogPostStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export type BlogSortOption =
  | "NEWEST"
  | "OLDEST"
  | "VIEWS_DESC"
  | "TITLE_ASC";

export interface BlogPostTag {
  id: string;
  name: string;
  slug: string;
  displayOrder?: number;
  status?: "ACTIVE" | "INACTIVE";
  _count?: {
    posts: number;
  };
}

export interface BlogPostAuthor {
  id?: string;
  fullName: string;
  avatar?: string;
}

export interface BlogPostThumbnail {
  id?: string;
  url: string;
  altText?: string;
}

export interface BlogPostImageItem {
  id?: string;
  url: string;
  altText?: string;
  isThumbnail?: boolean;
  displayOrder?: number;
}

export interface BlogPostListItem {
  id: string;
  code?: string;
  slug: string;
  title: string;
  excerpt: string;
  tag: BlogPostTag;
  author?: BlogPostAuthor;
  thumbnail: BlogPostThumbnail | null;
  status: BlogPostStatus;
  isFeatured: boolean;
  showOnHome: boolean;
  viewCount: number;
  readTimeMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  relatedProductIds?: string[];
}

export interface BlogPostDetail extends BlogPostListItem {
  contentHtml: string;
  toc?: { id: string; text: string; level: number }[];
  metaTitle?: string;
  metaDescription?: string;
  images: BlogPostImageItem[];
}

export interface CreateAdminBlogPostDto {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  tagId: string;
  status: BlogPostStatus;
  isFeatured: boolean;
  showOnHome: boolean;
  readTimeMinutes: number;
  publishedAt?: string | null;
  metaTitle?: string;
  metaDescription?: string;
  thumbnailUrl?: string;
  images?: BlogPostImageItem[];
  relatedProductIds?: string[];
}

export interface UpdateAdminBlogPostDto extends Partial<CreateAdminBlogPostDto> {}

export interface AdminBlogPostListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: BlogPostStatus;
  tagId?: string;
  sort?: BlogSortOption;
  isFeatured?: boolean;
}

export interface AdminBlogPostListResponse {
  items: BlogPostListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
