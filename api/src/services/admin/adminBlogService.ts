import { Prisma, BlogPostStatus } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import type {
  AdminBlogPostListQueryDto,
  CreateAdminBlogPostDto,
  UpdateAdminBlogPostDto,
} from "@/dto/admin/adminBlogDto.js";
import { AppError } from "@/utils/appError.js";

function formatThumbnail(images: { id: string; url: string; altText: string | null; isThumbnail: boolean }[]) {
  const thumb = images.find((i) => i.isThumbnail) ?? images[0] ?? null;
  return thumb
    ? {
        id: thumb.id,
        url: thumb.url,
        altText: thumb.altText || undefined,
      }
    : null;
}

export const adminBlogService = {
  async listTags() {
    const existingTags = await prisma.blogTag.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        code: true,
        name: true,
        slug: true,
        displayOrder: true,
        status: true,
        _count: {
          select: {
            posts: {
              where: { deletedAt: null },
            },
          },
        },
      },
    });
    return existingTags;
  },

  async createTag(body: { name: string; slug?: string }) {
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");

    const code = `TAG-${Date.now().toString().slice(-6)}`;

    return prisma.blogTag.create({
      data: {
        code,
        name: body.name,
        slug,
        status: "ACTIVE",
      },
    });
  },

  async updateTag(id: string, body: { name?: string; slug?: string }) {
    const existing = await prisma.blogTag.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Không tìm thấy chủ đề cần cập nhật.", 404);
    }
    const slug = body.slug
      ? body.slug
      : body.name
      ? body.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
      : undefined;

    return prisma.blogTag.update({
      where: { id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(slug ? { slug } : {}),
      },
    });
  },

  async deleteTag(id: string) {
    const existing = await prisma.blogTag.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Không tìm thấy chủ đề cần xóa.", 404);
    }
    const count = await prisma.blogPost.count({
      where: { tagId: id, deletedAt: null },
    });
    if (count > 0) {
      throw new AppError(
        `Không thể xóa chủ đề đang có ${count} bài viết liên kết.`,
        400
      );
    }
    return prisma.blogTag.delete({ where: { id } });
  },

  async listPosts(query: AdminBlogPostListQueryDto) {
    const where: Prisma.BlogPostWhereInput = {
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.tagId ? { tagId: query.tagId } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: "insensitive" } },
              { excerpt: { contains: query.search, mode: "insensitive" } },
              { slug: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.BlogPostOrderByWithRelationInput[] =
      query.sort === "OLDEST"
        ? [{ createdAt: "asc" }]
        : query.sort === "VIEWS_DESC"
        ? [{ viewCount: "desc" }]
        : query.sort === "TITLE_ASC"
        ? [{ title: "asc" }]
        : [{ createdAt: "desc" }];

    const skip = (query.page - 1) * query.limit;

    const [posts, total] = await prisma.$transaction([
      prisma.blogPost.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        include: {
          tag: {
            select: { id: true, name: true, slug: true },
          },
          author: {
            select: { id: true, fullName: true, avatar: true },
          },
          images: {
            orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    const items = posts.map((post) => ({
      id: post.id,
      code: post.code,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      tag: post.tag,
      author: post.author,
      thumbnail: formatThumbnail(post.images),
      status: post.status,
      isFeatured: post.isFeatured,
      showOnHome: post.showOnHome,
      viewCount: post.viewCount,
      readTimeMinutes: post.readTimeMinutes,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return {
      items,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    };
  },

  async getPostDetail(id: string) {
    const post = await prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
      include: {
        tag: true,
        author: {
          select: { id: true, fullName: true, avatar: true },
        },
        images: {
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!post) {
      throw new AppError("Không tìm thấy bài viết.", 404);
    }

    return {
      id: post.id,
      code: post.code,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      contentHtml: post.contentHtml,
      toc: post.toc,
      tag: post.tag,
      author: post.author,
      thumbnail: formatThumbnail(post.images),
      status: post.status,
      isFeatured: post.isFeatured,
      showOnHome: post.showOnHome,
      viewCount: post.viewCount,
      readTimeMinutes: post.readTimeMinutes,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      images: post.images.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText || undefined,
        isThumbnail: img.isThumbnail,
        displayOrder: img.displayOrder,
      })),
    };
  },

  async createPost(body: CreateAdminBlogPostDto, authorUserId?: string) {
    let resolvedAuthorId = authorUserId;
    if (resolvedAuthorId) {
      const exists = await prisma.user.findUnique({ where: { id: resolvedAuthorId } });
      if (!exists) resolvedAuthorId = undefined;
    }
    if (!resolvedAuthorId) {
      const adminUser = await prisma.user.findFirst({
        where: { role: { in: ["SUPER_ADMIN", "ADMIN", "STAFF_CONTENT"] } },
        select: { id: true },
      });
      resolvedAuthorId = adminUser?.id;
      if (!resolvedAuthorId) {
        const anyUser = await prisma.user.findFirst({ select: { id: true } });
        if (!anyUser) {
          throw new AppError("Chưa có tài khoản nào trong hệ thống để gắn tác giả bài viết.", 400);
        }
        resolvedAuthorId = anyUser.id;
      }
    }

    // Resolve valid tagId
    let resolvedTagId = body.tagId;
    let foundTag = null;
    if (resolvedTagId) {
      try {
        foundTag = await prisma.blogTag.findUnique({
          where: { id: resolvedTagId },
        });
      } catch {
        foundTag = null;
      }
    }

    if (!foundTag) {
      foundTag = await prisma.blogTag.findFirst({
        where: { status: "ACTIVE" },
        orderBy: [{ displayOrder: "asc" }],
      });
      if (!foundTag) {
        foundTag = await prisma.blogTag.create({
          data: {
            code: "TAG-01",
            name: "Mẹo đan móc len",
            slug: "meo-dan-moc-len",
            displayOrder: 1,
            status: "ACTIVE",
          },
        });
      }
    }
    resolvedTagId = foundTag.id;

    // Check slug uniqueness
    let finalSlug = body.slug;
    const existingPostWithSlug = await prisma.blogPost.findFirst({
      where: { slug: finalSlug, deletedAt: null },
    });
    if (existingPostWithSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const code = `BP-${Date.now().toString().slice(-6)}`;

    const post = await prisma.blogPost.create({
      data: {
        code,
        title: body.title,
        slug: finalSlug,
        excerpt: body.excerpt,
        contentHtml: body.contentHtml,
        tag: {
          connect: { id: resolvedTagId },
        },
        author: {
          connect: { id: resolvedAuthorId },
        },
        status: body.status,
        isFeatured: body.isFeatured,
        showOnHome: body.showOnHome,
        readTimeMinutes: body.readTimeMinutes,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        images: {
          create: [
            ...(body.thumbnailUrl
              ? [
                  {
                    url: body.thumbnailUrl,
                    altText: body.title,
                    isThumbnail: true,
                    displayOrder: 0,
                  },
                ]
              : []),
            ...(body.images || [])
              .filter((i) => i.url !== body.thumbnailUrl)
              .map((i, idx) => ({
                url: i.url,
                altText: i.altText,
                isThumbnail: Boolean(i.isThumbnail),
                displayOrder: idx + 1,
              })),
          ],
        },
      },
    });

    return this.getPostDetail(post.id);
  },

  async updatePost(id: string, body: UpdateAdminBlogPostDto) {
    const existing = await prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new AppError("Không tìm thấy bài viết để cập nhật.", 404);
    }

    let resolvedTagId = body.tagId;
    if (resolvedTagId) {
      try {
        const found = await prisma.blogTag.findUnique({
          where: { id: resolvedTagId },
        });
        if (!found) resolvedTagId = undefined;
      } catch {
        resolvedTagId = undefined;
      }
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...(body.title ? { title: body.title } : {}),
        ...(body.slug ? { slug: body.slug } : {}),
        ...(body.excerpt ? { excerpt: body.excerpt } : {}),
        ...(body.contentHtml ? { contentHtml: body.contentHtml } : {}),
        ...(resolvedTagId ? { tag: { connect: { id: resolvedTagId } } } : {}),
        ...(body.status ? { status: body.status } : {}),
        ...(body.isFeatured !== undefined ? { isFeatured: body.isFeatured } : {}),
        ...(body.showOnHome !== undefined ? { showOnHome: body.showOnHome } : {}),
        ...(body.readTimeMinutes ? { readTimeMinutes: body.readTimeMinutes } : {}),
        ...(body.publishedAt !== undefined
          ? { publishedAt: body.publishedAt ? new Date(body.publishedAt) : null }
          : {}),
        ...(body.metaTitle !== undefined ? { metaTitle: body.metaTitle } : {}),
        ...(body.metaDescription !== undefined
          ? { metaDescription: body.metaDescription }
          : {}),
      },
    });

    if (body.thumbnailUrl) {
      await prisma.blogPostImage.deleteMany({
        where: { blogPostId: id, isThumbnail: true },
      });
      await prisma.blogPostImage.create({
        data: {
          blogPostId: id,
          url: body.thumbnailUrl,
          altText: body.title || existing.title,
          isThumbnail: true,
          displayOrder: 0,
        },
      });
    }

    return this.getPostDetail(id);
  },

  async updateStatus(id: string, status: BlogPostStatus) {
    const existing = await prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new AppError("Không tìm thấy bài viết.", 404);
    }

    return prisma.blogPost.update({
      where: { id },
      data: {
        status,
        ...(status === "PUBLISHED" && !existing.publishedAt
          ? { publishedAt: new Date() }
          : {}),
      },
    });
  },

  async deletePost(id: string) {
    const existing = await prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new AppError("Không tìm thấy bài viết để xóa.", 404);
    }

    await prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
