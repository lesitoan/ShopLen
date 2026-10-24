import { Prisma } from "@prisma/client";
import { createCategoryState } from "./categoryState.js";

type Row = Record<string, unknown>;
type Query = { where?: Row; select?: Row; orderBy?: Row | Row[]; skip?: number; take?: number; data?: Row };

function matches(value: unknown, filter: unknown): boolean {
  if (filter === null || typeof filter !== "object") return value === filter;
  if (Array.isArray(filter)) return filter.every((part) => matches(value, part));
  return Object.entries(filter).every(([key, expected]) => {
    if (key === "mode") return true;
    if (key === "in") return (expected as unknown[]).includes(value);
    if (key === "notIn") return !(expected as unknown[]).includes(value);
    if (key === "not") return !matches(value, expected);
    if (key === "gt") return Number(value) > Number(expected);
    if (key === "gte") return Number(value) >= Number(expected);
    if (key === "lte") return Number(value) <= Number(expected);
    if (key === "contains") return String(value ?? "").toLowerCase().includes(String(expected).toLowerCase());
    if (key === "some") return Array.isArray(value) && value.some((item) => matches(item, expected));
    if (key === "array_contains") return Array.isArray(value) && (expected as unknown[]).every((part) => value.some((item) => matches(item, part)));
    if (key === "AND") return (expected as unknown[]).every((part) => matches(value, part));
    if (key === "OR") return (expected as unknown[]).some((part) => matches(value, part));
    return value !== null && typeof value === "object" && matches(Reflect.get(value, key), expected);
  });
}

function queryRows(rows: Row[], query: Query): Row[] {
  let result = rows.filter((row) => !query.where || matches(row, query.where));
  const order = query.orderBy ? (Array.isArray(query.orderBy) ? query.orderBy : [query.orderBy]) : [];
  result = [...result].sort((left, right) => {
    for (const item of order) {
      for (const [key, direction] of Object.entries(item)) {
        const a = left[key], b = right[key];
        if (a === b) continue;
        const compared = a == null ? 1 : b == null ? -1 : a < b ? -1 : a > b ? 1 : 0;
        if (compared) return direction === "desc" ? -compared : compared;
      }
    }
    return 0;
  });
  result = result.slice(query.skip ?? 0, query.take === undefined ? undefined : (query.skip ?? 0) + query.take);
  if (!query.select) return result;
  const select = query.select;
  return result.map((row) => Object.fromEntries(Object.entries(select).filter(([, enabled]) => enabled).map(([key, selection]) => {
    const value = row[key];
    if (selection === true) return [key, value];
    const nested = selection as Query;
    return [key, Array.isArray(value) ? queryRows(value, nested) : queryRows([value as Row], nested)[0]];
  })));
}

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
