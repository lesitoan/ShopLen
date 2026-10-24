import { Prisma, type Category } from "@prisma/client";
import { createAuthState } from "./authState.js";

export async function createCategoryState() {
  const state = await createAuthState();
  const instant = new Date("2026-01-01T00:00:00.000Z");
  const seed: Category = { id: "00000000-0000-4000-8000-000000000100", code: "CAT_TEST", name: "Len", slug: "len", description: null, image: null, status: "ACTIVE", displayOrder: 0, createdAt: instant, updatedAt: instant };
  const categories = new Map([[seed.id, seed]]);
  const productCounts = new Map<string, number>();
  const queries: Array<{ model: string; method: string; args: Record<string, unknown> }> = [];
  const missing = () => new Prisma.PrismaClientKnownRequestError("missing category", { code: "P2025", clientVersion: "7.9.0" });
  const unique = (data: Partial<Category>, id?: string) => {
    if ([...categories.values()].some((item) => item.id !== id && (data.name === item.name || data.slug === item.slug))) {
      throw new Prisma.PrismaClientKnownRequestError("duplicate category", { code: "P2002", clientVersion: "7.9.0" });
    }
  };
  const category = {
    findUnique: async ({ where }: { where: { id: string } }) => categories.get(where.id) ?? null,
    findMany: async (args: { where: { status?: string }; select: Record<string, unknown> }) => {
      queries.push({ model: "category", method: "findMany", args });
      return [...categories.values()].filter((item) => !args.where.status || item.status === args.where.status).map((item) => Object.fromEntries(Object.keys(args.select).map((key) => [key, Reflect.get(item, key)])));
    },
    count: async () => categories.size,
    create: async ({ data }: { data: Partial<Category> }) => {
      unique(data);
      const item = { ...seed, ...data, image: data.image ?? null, id: "00000000-0000-4000-8000-000000000101" };
      categories.set(item.id, item);
      return item;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<Category> }) => {
      const item = categories.get(where.id);
      if (!item) throw missing();
      unique(data, item.id);
      Object.assign(item, Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)));
      return item;
    },
    delete: async ({ where }: { where: { id: string } }) => { if (!categories.delete(where.id)) throw missing(); },
  };
  const prisma = Object.assign(state.prisma, {
    category,
    product: { count: async ({ where }: { where: { categoryId: string } }) => productCounts.get(where.categoryId) ?? 0 },
    $transaction: async <T>(queries: Array<Promise<T>>) => Promise.all(queries),
  });
  return { ...state, prisma, categories, productCounts, queries, category: seed };
}
