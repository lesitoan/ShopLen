import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { startAuthApplication, authRequest } from "../harness/authApplication.js";
import { createCatalogState } from "../fixtures/catalogState.js";
import { startLegacyServer } from "../harness/contractHarness.js";

test("JSON size limits reject oversized collections before validation/database access and preserve Express errors", async () => {
  const state = await createCatalogState();
  const server = await startAuthApplication(async () => state);
  let legacy: Awaited<ReturnType<typeof startLegacyServer>> | undefined;
  try {
    legacy = await startLegacyServer();
    const results = [];
    const body = JSON.stringify({ ids: Array.from({ length: 40000 }, () => "invalid") });
    assert.ok(Buffer.byteLength(body) > 100 * 1024);
    for (const url of [legacy.url, server.url]) {
      const response = await fetch(`${url}/api/v1/cart/products`, { method: "POST", headers: { "content-type": "application/json" }, body });
      results.push({ status: response.status, body: await response.json() });
    }
    assert.deepEqual(results[1], results[0]);
    assert.ok(results[1]!.status >= 400);
    assert.equal(state.productQueries.length, 0);
    const small = await authRequest(server.url, "/cart/products", { ids: Array.from({ length: 101 }, () => "invalid") });
    assert.equal(small.response.status, 422);
    assert.equal(small.body.errorCode, "VALIDATION_ERROR");
    assert.equal(state.productQueries.length, 0);
    assert.equal((await fetch(`${server.url}/health`)).status, 200);
  } finally { await legacy?.close(); await server.close(); }
});
