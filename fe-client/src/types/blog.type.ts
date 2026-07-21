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
  readTime: string;
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
