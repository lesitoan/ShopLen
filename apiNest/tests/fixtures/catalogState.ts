import { Prisma } from "@prisma/client";
import { createCategoryState } from "./categoryState.js";

import { queryRows, type Row, type Query } from "../harness/queryFixture.js";

export async function createCatalogState(KnownError = Prisma.PrismaClientKnownRequestError) {
  const state = await createCategoryState(KnownError);
  const instant = new Date("2026-01-01T00:00:00.000Z");
  let sequence = 200;
  const nextId = () => `00000000-0000-4000-8000-${String(sequence++).padStart(12, "0")}`;
  const queries: Array<{ method: string; args: Query }> = [];
  const products = new Map<string, Row>();
  const failures = { update: false };
  const error = (code: string) => new KnownError("catalog fixture error", { code, clientVersion: "7.9.0" });
  const relation = (productId: string, data: Row) => ({ id: nextId(), productId, createdAt: instant, updatedAt: instant, ...data });
  const seedProduct = (overrides: Row = {}) => {
    const id = nextId();
    const item: Row = {
      id, code: `SP${id.slice(-3)}`, name: `Product ${id.slice(-3)}`, slug: `product-${id.slice(-3)}`, categoryId: state.category.id,
      shortDescription: null, descriptionHtml: null, careInstructionHtml: null, originalPrice: 100000, salePrice: null,
      stockQuantity: 5, soldCount: 0, status: "ACTIVE", highlightType: "HOT_PRODUCT", metaTitle: null, metaDescription: null,
      createdAt: instant, updatedAt: instant, deletedAt: null,
      images: [relation(id, { url: "https://example.test/product.png", publicId: null, altText: null, isThumbnail: true, displayOrder: 0 })],
      options: [relation(id, { optionType: "COLOR", name: "Màu", displayOrder: 0, values: [{ code: "RED", label: "Đỏ" }] })],
      ...overrides,
    };
    products.set(id, item);
    return item;
  };
  const reference = seedProduct({ code: "SP_REFERENCE", slug: "reference", soldCount: 10 });
  const sale = seedProduct({ code: "SP_SALE", slug: "sale", salePrice: 80000, soldCount: 20 });
  const empty = seedProduct({ code: "SP_EMPTY", slug: "empty", stockQuantity: 0, images: [] });
  const hidden = seedProduct({ code: "SP_HIDDEN", slug: "hidden", status: "HIDDEN" });
  const deleted = seedProduct({ code: "SP_DELETED", slug: "deleted", deletedAt: instant });
  const hydrated = (row: Row) => ({ ...row, category: state.categories.get(row.categoryId as string) });
  const unique = (data: Row, id?: string) => {
    if ([...products.values()].some((item) => item.id !== id && (data.code !== undefined && data.code === item.code || data.slug !== undefined && data.slug === item.slug))) throw error("P2002");
  };
  const apply = (item: Row, data: Row) => {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      if (key === "images" || key === "options") {
        const created = (value as { create: Row[] }).create.map((row) => relation(item.id as string, key === "images" ? { publicId: null, altText: null, ...row } : row));
        item[key] = [...item[key] as Row[], ...created];
      } else item[key] = value;
    }
  };
  const product = {
    findMany: async (args: Query) => { queries.push({ method: "findMany", args }); return queryRows([...products.values()].map(hydrated), args); },
    findFirst: async (args: Query) => { queries.push({ method: "findFirst", args }); return queryRows([...products.values()].map(hydrated), args)[0] ?? null; },
    count: async (args: Query) => queryRows([...products.values()].map(hydrated), { where: args.where }).length,
    create: async (args: Query) => {
      const data = args.data!;
      unique(data);
      const item = seedProduct({ code: data.code, slug: data.slug, images: [], options: [], highlightType: null });
      apply(item, data);
      return queryRows([hydrated(item)], { select: args.select })[0];
    },
    update: async (args: Query) => {
      if (failures.update) throw error("P2002");
      const item = products.get(args.where!.id as string);
      if (!item) throw error("P2025");
      unique(args.data!, item.id as string);
      apply(item, args.data!);
      return queryRows([hydrated(item)], { select: args.select })[0];
    },
  };
  const prisma = Object.assign(state.prisma, {
    product,
    productImage: { deleteMany: async ({ where }: { where: { productId: string } }) => { products.get(where.productId)!.images = []; } },
    productOption: { deleteMany: async ({ where }: { where: { productId: string } }) => { products.get(where.productId)!.options = []; } },
    $transaction: async (query: Array<Promise<unknown>> | ((transaction: unknown) => Promise<unknown>)) => {
      if (Array.isArray(query)) return Promise.all(query);
      const snapshot = structuredClone(products);
      try { return await query(prisma); }
      catch (error) { products.clear(); for (const [id, item] of snapshot) products.set(id, item); throw error; }
    },
  });
  return { ...state, prisma, products, reference, sale, empty, hidden, deleted, productQueries: queries, failures };
}
