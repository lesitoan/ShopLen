import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";
import { createCatalogState } from "../fixtures/catalogState.js";

test("public cart lookup keeps first-seen order, deduplicates and distinguishes unavailable, out-of-stock and missing products", async () => {
  const state = await createCatalogState();
  const server = await startAuthApplication(async () => state);
  const missing = "00000000-0000-4000-8000-000000000999";
  const ids = [state.sale.id, state.hidden.id, state.empty.id, state.deleted.id, missing, state.sale.id, state.reference.id];
  try {
    const result = await authRequest(server.url, "/cart/products", { ids });
    assert.equal(result.response.status, 200);
    const items = result.body.data.items;
    assert.deepEqual(items.map((item: { id: string }) => item.id), [...new Set(ids)]);
    assert.equal(items[0].price, 80000);
    assert.equal(items[0].isAvailable, true);
    assert.equal(items[0].options[0].optionType, "COLOR");
    assert.equal(items[1].unavailableReason, "PRODUCT_UNAVAILABLE");
    assert.equal(items[2].unavailableReason, "OUT_OF_STOCK");
    assert.equal(items[2].image, null);
    assert.equal(items[3].unavailableReason, "PRODUCT_UNAVAILABLE");
    assert.deepEqual(items[4], { id: missing, code: null, name: null, slug: null, category: null, image: null, imageAlt: null, originalPrice: null, salePrice: null, price: 0, stockQuantity: 0, isAvailable: false, unavailableReason: "PRODUCT_NOT_FOUND", options: [] });
    assert.deepEqual(state.productQueries.at(-1)?.args.where, { id: { in: [...new Set(ids)] } });
    assert.equal((await authRequest(server.url, "/cart/products", { ids: [] })).response.status, 422);
    assert.equal((await authRequest(server.url, "/cart/products", { ids: ["invalid"] })).response.status, 422);
  } finally { await server.close(); }
});
