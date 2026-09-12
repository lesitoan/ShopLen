import { Prisma } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import { getCachedHomeBlogPosts } from "@/services/client/blogs/blogCacheService.js";
import type { BlogPostListQueryDto } from "@/dto/client/blogDto.js";

type BlogPostListItem = Awaited<ReturnType<typeof findBlogPosts>>[number];
type BlogTagItem = Awaited<ReturnType<typeof findBlogTags>>[number];

function formatThumbnail(images: BlogPostListItem["images"]) {
  const thumbnail = images[0] ?? null;

  return thumbnail
    ? {
        id: thumbnail.id,
        url: thumbnail.url,
        altText: thumbnail.altText,
      }
    : null;
}

function formatTag(tag: BlogTagItem) {
  return {
    id: tag.id,
    key: tag.slug,
    label: tag.name,
    slug: tag.slug,
    displayOrder: tag.displayOrder,
  };
}

function formatPostListItem(post: BlogPostListItem) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    thumbnail: formatThumbnail(post.images),
    tag: {
      id: post.tag.id,
      key: post.tag.slug,
      label: post.tag.name,
      slug: post.tag.slug,
    },
    publishedAt: post.publishedAt?.toISOString() ?? null,
    readTimeMinutes: post.readTimeMinutes,
  };
}

function buildPostWhere(query: BlogPostListQueryDto): Prisma.BlogPostWhereInput {
  const andFilters: Prisma.BlogPostWhereInput[] = [
    {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
      tag: { status: "ACTIVE" },
    },
  ];

  if (query.tag) {
    andFilters.push({
      tag: {
        slug: query.tag,
        status: "ACTIVE",
      },
    });
  }

  if (query.search) {
    andFilters.push({
      OR: [
        { title: { contains: query.search, mode: "insensitive" } },
        { excerpt: { contains: query.search, mode: "insensitive" } },
      ],
    });
  }

  if (query.home) {
    andFilters.push({ showOnHome: true });
  }

  return { AND: andFilters };
}

function findBlogTags() {
  return prisma.blogTag.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      displayOrder: true,
    },
  });
}

function findBlogPosts(args: {
  where: Prisma.BlogPostWhereInput;
  skip: number;
  take: number;
}) {
  return prisma.blogPost.findMany({
    where: args.where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    skip: args.skip,
    take: args.take,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      readTimeMinutes: true,
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        where: { isThumbnail: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        take: 1,
        select: {
          id: true,
          url: true,
          altText: true,
        },
      },
    },
  });
}

function findFeaturedBlogPost() {
  return prisma.blogPost.findFirst({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
      isFeatured: true,
      tag: { status: "ACTIVE" },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      readTimeMinutes: true,
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        where: { isThumbnail: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        take: 1,
        select: {
          id: true,
          url: true,
          altText: true,
        },
      },
    },
  });
}

export const blogService = {
  async listTags() {
    const tags = await findBlogTags();

    return tags.map(formatTag);
  },

  async listPosts(query: BlogPostListQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const where = buildPostWhere(query);

    const loadPosts = async () => {
      const [totalItems, posts] = await prisma.$transaction([
        prisma.blogPost.count({ where }),
        findBlogPosts({ where, skip, take: limit }),
      ]);

      return {
        items: posts.map(formatPostListItem),
        pagination: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      };
    };

    const isHomeCacheRequest =
      query.home && page === 1 && limit === 4 && !query.tag && !query.search;

    return isHomeCacheRequest ? getCachedHomeBlogPosts(loadPosts) : loadPosts();
  },

  async getFeaturedPost() {
    const post = await findFeaturedBlogPost();

    return post ? formatPostListItem(post) : null;
  },

  async getPostBySlug(slug: string) {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        deletedAt: null,
        publishedAt: { lte: new Date() },
        tag: { status: "ACTIVE" },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        contentHtml: true,
        toc: true,
        readTimeMinutes: true,
        metaTitle: true,
        metaDescription: true,
        publishedAt: true,
        author: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
        tag: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
          select: {
            id: true,
            url: true,
            altText: true,
            isThumbnail: true,
          },
        },
      },
    });

    if (!post) return null;

    // Increment view count asynchronously
    prisma.blogPost
      .update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    const thumbnail =
      post.images.find((img) => img.isThumbnail) ?? post.images[0] ?? null;

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      contentHtml: post.contentHtml,
      toc: post.toc,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      readTimeMinutes: post.readTimeMinutes,
      author: post.author?.fullName || "Tiệm Len Nhà Kiều",
      authorAvatar: post.author?.avatar || "/logo.png",
      tag: {
        id: post.tag.id,
        key: post.tag.slug,
        label: post.tag.name,
        slug: post.tag.slug,
      },
      thumbnail: thumbnail
        ? {
            id: thumbnail.id,
            url: thumbnail.url,
            altText: thumbnail.altText,
          }
        : null,
    };
  },
};
