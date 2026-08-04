export interface BlogTag {
  key: string;
  label: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  tag: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTimeMinutes?: number;
}

export interface FeaturedPost extends BlogPost {
  isMainHero: boolean;
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface BlogDetail extends BlogPost {
  content: string;
  toc?: TocItem[];
}

export interface FeaturedProduct {
  id: number;
  slug: string;
  name: string;
  thumbnail: string;
  price: number;
}

export interface BlogTagApiItem {
  id: number;
  key: string;
  label: string;
  slug: string;
  displayOrder: number;
}

export interface BlogPostApiItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: {
    id: number;
    url: string;
    altText?: string | null;
  } | string | null;
  tag: {
    id: number;
    key: string;
    label: string;
    slug: string;
  } | string;
  publishedAt: string | null;
  readTimeMinutes: number;
  author?: string;
  authorAvatar?: string;
}

export interface BlogPostListParams {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
  home?: boolean;
}

export interface BlogPostListResponse {
  items: BlogPostApiItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface BlogDetailApiItem extends BlogPostApiItem {
  contentHtml?: string;
  content?: string;
  toc?: TocItem[] | any;
  metaTitle?: string | null;
  metaDescription?: string | null;
}
