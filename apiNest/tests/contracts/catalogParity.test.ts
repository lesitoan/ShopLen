import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { startAuthApplication } from "../harness/authApplication.js";
import { startLegacyServer } from "../harness/contractHarness.js";
import { createCatalogState } from "../fixtures/catalogState.js";

test("all 16 catalog/cart endpoints preserve Express contracts on independent frozen fixtures", async (context) => {
  context.mock.method(Date, "now", () => new Date("2026-01-15T00:00:00.000Z").getTime());
  const state = await createCatalogState();
  const nest = await startAuthApplication(async () => state);
  let legacy: Awaited<ReturnType<typeof startLegacyServer>> | undefined;
  try {
    legacy = await startLegacyServer("legacyCatalogServer.mjs");
    const token = nest.app.get(TokenService).signAdminAccessToken({ sub: state.user.id, email: state.user.email, role: "ADMIN", tokenType: "ADMIN" });
    const visited = new Set<string>();
    const compare = async (method: string, path: string, body?: unknown) => {
      const results = [];
      for (const url of [legacy!.url, nest.url]) {
        const response = await fetch(`${url}/api/v1${path}`, {
          method, headers: { "Content-Type": "application/json", ...(path.startsWith("/admin") ? { Authorization: `Bearer ${token}` } : {}) },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        });
        results.push({ status: response.status, body: await response.json(), cache: response.headers.get("cache-control"), type: response.headers.get("content-type") });
      }
      assert.deepEqual(results[1], results[0], `${method} ${path}`);
      visited.add(`${method} ${path.split("?")[0]!.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ":id")}`);
      return results[1]!;
    };
    await compare("GET", "/categories");
    await compare("GET", "/admin/categories?sort=NAME_ASC&search=%20len%20");
    await compare("GET", `/admin/categories/${state.category.id}`);
    await compare("POST", "/admin/categories", { name: "Thử nghiệm", slug: "thu-nghiem", image: "" });
    await compare("POST", "/admin/categories", { name: "Thử nghiệm", slug: "thu-nghiem" });
    const categoryId = "00000000-0000-4000-8000-000000000101";
    await compare("PATCH", `/admin/categories/${categoryId}`, { name: "Đã cập nhật", image: null });
    await compare("DELETE", `/admin/categories/${categoryId}`);
    await compare("DELETE", `/admin/categories/${state.category.id}`);
    await compare("GET", "/products/home?types=HOT_PRODUCT,HOT_PRODUCT,BEST_SELLING&limit=1");
    await compare("GET", "/products/home?types=INVALID");
    await compare("GET", "/products?sort=PRICE_ASC&minPrice=80000&maxPrice=100000&colorCodes=red,RED");
    await compare("GET", "/products?categoryIds[]=00000000-0000-4000-8000-000000000999");
    await compare("GET", `/products?categoryIds=${state.category.id}&categoryIds=${state.category.id}`);
    await compare("POST", "/products/recommendations", { productIds: [state.reference.id, state.reference.id], limit: 12 });
    await compare("GET", "/products/reference");
    await compare("GET", "/admin/products?statuses=ACTIVE,HIDDEN&sort=STOCK_DESC");
    const created = await compare("POST", "/admin/products", { code: "SP_PARITY", name: "Product parity", slug: "parity", categoryId: state.category.id, originalPrice: 100000, salePrice: 90000, images: ["https://example.test/parity.png"], options: [{ optionType: "SIZE", name: "Size", values: [{ code: "S", label: "Small" }] }] });
    const id = created.body.data.id;
    await compare("GET", `/admin/products/${id}`);
    await compare("PATCH", `/admin/products/${id}`, { originalPrice: 80000 });
    await compare("PATCH", `/admin/products/${id}`, { salePrice: null, images: ["https://example.test/new.png"], options: [], shortDescription: "" });
    await compare("DELETE", `/admin/products/${id}`);
    await compare("POST", "/cart/products", { ids: [state.sale.id, state.sale.id, state.empty.id, state.hidden.id, state.deleted.id, id, "00000000-0000-4000-8000-000000000999"] });
    assert.equal(visited.size, 16);
  } finally {
    await legacy?.close();
    await nest.close();
  }
});
