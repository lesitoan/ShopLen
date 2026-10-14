import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";

test("source contract manifest covers 80 mounted endpoints and compatibility exceptions", () => {
  const manifest = JSON.parse(readFileSync(resolve("tests/fixtures/legacyContracts.json"), "utf8"));
  const routes = manifest.endpoints as Array<{
    method: string; path: string; middleware: string[]; verification: string;
  }>;
  assert.equal(routes.length, 80);
  assert.equal(new Set(routes.map((route) => `${route.method} ${route.path}`)).size, 80);
  const find = (method: string, path: string) => {
    const route = routes.find((item) => item.method === method && item.path === `/api/v1${path}`);
    assert.ok(route, `${method} ${path}`);
    return route;
  };
  assert.ok(find("POST", "/cart/products"));
  assert.ok(find("GET", "/admin/amalytics/dashboard/summary"));
  assert.ok(find("POST", "/admin/orders/:id/confirm-payment"));
  assert.ok(find("POST", "/admin/orders/:id/confirmPayment"));
  assert.equal(find("POST", "/orders/lookup").middleware.some((value) => value.includes("customerAuthMiddleware")), false);
  assert.equal(find("GET", "/orders/:id").middleware.some((value) => value.includes("customerAuthMiddleware")), true);
  assert.equal(find("GET", "/payments/:orderId/qr").middleware.some((value) => value.includes("AuthMiddleware")), false);
  assert.ok(routes.every((route) => route.verification === "SOURCE_CAPTURED_RUNTIME_PENDING"));
  assert.ok(Object.keys(manifest.schemas).length > 40);
});
