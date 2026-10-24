import { Prisma } from "@prisma/client";
import { createAuthState } from "./authState.js";
import { queryRows, type Row, type Query } from "../harness/queryFixture.js";

export async function createBlogState(KnownError = Prisma.PrismaClientKnownRequestError) {
  const state = await createAuthState();
  const instant = new Date("2026-01-01T00:00:00.000Z");
  let sequence = 500;
  const nextId = () => `00000000-0000-4000-8000-${String(sequence++).padStart(12, "0")}`;
  const tags = new Map<string, Row>();
  const posts = new Map<string, Row>();
  const queries: Array<{ model: string; method: string; args: Query }> = [];
  const failure = { viewCount: false };
  const error = (code: string) => new KnownError("blog fixture error", { code, clientVersion: "7.9.0" });
  const seedTag = (overrides: Row = {}) => {
    const id = nextId();
    const item = { id, code: `TAG-${id.slice(-3)}`, name: "Chủ đề", slug: `tag-${id.slice(-3)}`, description: null, displayOrder: 0, status: "ACTIVE", createdAt: instant, updatedAt: instant, ...overrides };
    tags.set(id, item);
    return item;
  };
  const activeTag = seedTag();
  const hiddenTag = seedTag({ status: "HIDDEN" });
  const image = (postId: string, data: Row) => ({ id: nextId(), blogPostId: postId, publicId: null, altText: null, isThumbnail: false, displayOrder: 0, createdAt: instant, updatedAt: instant, ...data });
  const seedPost = (overrides: Row = {}) => {
    const id = nextId();
    const item: Row = { id, code: `BP-${id.slice(-3)}`, slug: `post-${id.slice(-3)}`, title: "Bài viết", excerpt: "Mô tả", contentHtml: "<p>Nội dung</p>", toc: null,
      tagId: activeTag.id, authorUserId: state.user.id, readTimeMinutes: 3, status: "PUBLISHED", isFeatured: false, showOnHome: true, viewCount: 0,
      metaTitle: null, metaDescription: null, publishedAt: instant, createdAt: instant, updatedAt: instant, deletedAt: null,
      images: [image(id, { url: "https://example.test/blog.png", isThumbnail: true })], ...overrides };
    posts.set(id, item);
    return item;
  };
  const published = seedPost({ slug: "published", isFeatured: true });
  const draft = seedPost({ slug: "draft", status: "DRAFT", publishedAt: null });
  const hidden = seedPost({ slug: "hidden", status: "HIDDEN" });
  const future = seedPost({ slug: "future", publishedAt: new Date("2100-01-01T00:00:00.000Z") });
  const deleted = seedPost({ slug: "deleted", deletedAt: instant });
  const inactiveTag = seedPost({ slug: "inactive-tag", tagId: hiddenTag.id });
  const undated = seedPost({ slug: "undated", publishedAt: null });
  const hydrate = (item: Row) => ({ ...item, tag: tags.get(item.tagId as string), author: state.users.get(item.authorUserId as string) ?? null });
  const updateScalars = (item: Row, data: Row) => {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      if (key === "tag") item.tagId = (value as { connect: { id: string } }).connect.id;
      else if (key === "author") item.authorUserId = (value as { connect: { id: string } }).connect.id;
      else if (key === "images") item.images = [...item.images as Row[], ...(value as { create: Row[] }).create.map((data) => image(item.id as string, data))];
      else if (key === "viewCount") item.viewCount = Number(item.viewCount) + (value as { increment: number }).increment;
      else item[key] = value;
    }
  };
  const blogPost = {
    findMany: async (args: Query) => { queries.push({ model: "blogPost", method: "findMany", args }); return queryRows([...posts.values()].map(hydrate), args); },
    findFirst: async (args: Query) => { queries.push({ model: "blogPost", method: "findFirst", args }); return queryRows([...posts.values()].map(hydrate), args)[0] ?? null; },
    count: async (args: Query) => queryRows([...posts.values()].map(hydrate), { where: args.where }).length,
    create: async ({ data }: { data: Row }) => {
      const item = seedPost({ status: "DRAFT", isFeatured: false, showOnHome: false, readTimeMinutes: 1, publishedAt: null, images: [] });
      updateScalars(item, data);
      return item;
    },
    update: async ({ where, data }: { where: { id: string }; data: Row }) => {
      if (failure.viewCount && data.viewCount) throw new Error("view counter unavailable");
      const item = posts.get(where.id);
      if (!item) throw error("P2025");
      updateScalars(item, data);
      return item;
    },
  };
  const blogTag = {
    findMany: async (args: Query) => {
      queries.push({ model: "blogTag", method: "findMany", args });
      const result = queryRows([...tags.values()], { ...args, select: args.select ? Object.fromEntries(Object.entries(args.select).filter(([key]) => key !== "_count")) : undefined });
      return args.select?._count ? result.map((tag) => ({ ...tag, _count: { posts: [...posts.values()].filter((post) => post.tagId === tag.id && post.deletedAt === null).length } })) : result;
    },
    findUnique: async ({ where }: { where: { id: string } }) => tags.get(where.id) ?? null,
    findFirst: async (args: Query) => queryRows([...tags.values()], args)[0] ?? null,
    create: async ({ data }: { data: Row }) => seedTag(data),
    update: async ({ where, data }: { where: { id: string }; data: Row }) => { const item = tags.get(where.id)!; Object.assign(item, data); return item; },
    delete: async ({ where }: { where: { id: string } }) => {
      if ([...posts.values()].some((post) => post.tagId === where.id)) throw error("P2003");
      const item = tags.get(where.id); tags.delete(where.id); return item;
    },
  };
  const prisma = Object.assign(state.prisma, {
    blogPost, blogTag,
    blogPostImage: {
      deleteMany: async ({ where }: { where: Row }) => { const post = posts.get(where.blogPostId as string)!; post.images = (post.images as Row[]).filter((image) => where.isThumbnail !== undefined && image.isThumbnail !== where.isThumbnail); },
      create: async ({ data }: { data: Row }) => { const row = image(data.blogPostId as string, data); (posts.get(data.blogPostId as string)!.images as Row[]).push(row); return row; },
    },
    $transaction: async (queries: Array<Promise<unknown>>) => Promise.all(queries),
  });
  Object.assign(prisma.user, { findFirst: async (query: Query) => queryRows([...state.users.values()], query)[0] ?? null });
  return { ...state, prisma, posts, tags, activeTag, hiddenTag, published, draft, hidden, future, deleted, inactiveTag, undated, queries, failure, seedPost };
}
