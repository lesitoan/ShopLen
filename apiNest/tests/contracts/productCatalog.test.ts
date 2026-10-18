import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";
import { createCatalogState } from "../fixtures/catalogState.js";

test("public catalog preserves filters, pagination, static home route, cached section sizing and unavailable detail", async () => {
  const state = await createCatalogState();
  const server = await startAuthApplication(async () => state);
  try {
    const home = await authRequest(server.url, "/products/home?types=HOT_PRODUCT,HOT_PRODUCT,BEST_SELLING&limit=1");
    assert.equal(home.response.status, 200);
    assert.equal(home.response.headers.get("cache-control"), "public, max-age=60, s-maxage=600, stale-while-revalidate=300");
    assert.deepEqual(Object.keys(home.body.data.sections), ["HOT_PRODUCT", "BEST_SELLING"]);
    assert.equal(home.body.data.sections.HOT_PRODUCT.items.length, 1);
    assert.equal(await state.redis.ttl("home:products:HOT_PRODUCT"), 600);
    const before = state.productQueries.length;
    const larger = await authRequest(server.url, "/products/home?types=HOT_PRODUCT&limit=12");
    assert.equal(larger.body.data.sections.HOT_PRODUCT.items.length, 3);
    assert.equal(state.productQueries.length, before);
    const query = `categoryIds=${state.category.id},${state.category.id}&colorCodes=red,RED&minPrice=80000&maxPrice=80000&sort=PRICE_ASC`;
    const filtered = await authRequest(server.url, `/products?${query}`);
    assert.equal(filtered.response.status, 200);
    assert.deepEqual(filtered.body.data.pagination, { page: 1, limit: 12, totalItems: 1, totalPages: 1 });
    assert.equal(filtered.body.data.items[0].id, state.sale.id);
    assert.equal(filtered.body.data.items[0].price, 80000);
    const args = state.productQueries.at(-1)!.args;
    assert.deepEqual(args.orderBy, [{ salePrice: "asc" }, { originalPrice: "asc" }, { createdAt: "desc" }]);
    assert.deepEqual(args.where, { AND: [
      { status: "ACTIVE", deletedAt: null }, { categoryId: { in: [state.category.id] } },
      { options: { some: { optionType: "COLOR", OR: [{ values: { array_contains: [{ code: "RED" }] } }] } } },
      { OR: [{ salePrice: { not: null, gte: 80000, lte: 80000 } }, { salePrice: null, originalPrice: { gte: 80000, lte: 80000 } }] },
    ] });
    assert.equal((await authRequest(server.url, "/products?minPrice=2&maxPrice=1")).response.status, 422);
    assert.equal((await authRequest(server.url, "/products?colorCodes=invalid-color")).response.status, 422);
    const bracketed = await authRequest(server.url, "/products?categoryIds[]=00000000-0000-4000-8000-000000000999");
    assert.deepEqual(bracketed.body.data.pagination, { page: 1, limit: 12, totalItems: 0, totalPages: 0 });
    const empty = await authRequest(server.url, "/products/empty");
    assert.equal(empty.body.data.stockQuantity, 0);
    assert.deepEqual(empty.body.data.images, []);
    for (const slug of ["hidden", "deleted", "missing"]) {
      assert.equal((await authRequest(server.url, `/products/${slug}`)).body.errorCode, "PRODUCT_NOT_FOUND");
    }
    const listing = await authRequest(server.url, "/products");
    assert.equal(listing.body.data.items.find((item: { id: string }) => item.id === state.empty.id).thumbnail, null);
  } finally { await server.close(); }
});

test("recommendations preserve frozen-clock ranking, exclusion, availability and fallback", async (context) => {
  const state = await createCatalogState();
  const server = await startAuthApplication(async () => state);
  context.mock.method(Date, "now", () => new Date("2026-01-15T00:00:00.000Z").getTime());
  try {
    const extra = structuredClone(state.sale);
    Object.assign(extra, { id: "00000000-0000-4000-8000-000000000300", code: "SP_SIMILAR", slug: "similar", salePrice: null, soldCount: 0 });
    state.products.set(extra.id as string, extra);
    const result = await authRequest(server.url, "/products/recommendations", { productIds: [state.reference.id, state.reference.id], limit: 12 });
    assert.equal(result.response.status, 200);
    assert.deepEqual(result.body.data.items.map((item: { id: string }) => item.id), [extra.id, state.sale.id]);
    const fallback = await authRequest(server.url, "/products/recommendations", { productIds: [] });
    assert.equal(fallback.body.data.items[0].id, state.sale.id);
    const detail = await authRequest(server.url, "/products/reference");
    assert.equal(detail.body.data.relatedProducts[0].id, extra.id);
    assert.equal(detail.body.data.options[0].optionType, "COLOR");
  } finally { await server.close(); }
});
