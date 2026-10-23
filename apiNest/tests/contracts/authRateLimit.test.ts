import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";

test("auth rate limits share counters across related customer and admin endpoints", async () => {
  const server = await startAuthApplication();
  try {
    for (const path of ["/auth/login", "/auth/register", "/auth/google", "/admin/auth/login", "/auth/login"]) {
      assert.equal((await authRequest(server.url, path, {})).response.status, 422);
    }
    const blocked = await authRequest(server.url, "/admin/auth/login", {});
    assert.equal(blocked.response.status, 429);
    assert.equal(blocked.body.errorCode, "RATE_LIMIT_EXCEEDED");
    assert.ok(blocked.response.headers.get("ratelimit"));
    for (let index = 0; index < 5; index++) {
      assert.equal((await authRequest(server.url, ["/auth/password/forgot", "/auth/password/otp/verify", "/auth/password/reset"][index % 3], {})).response.status, 422);
    }
    assert.equal((await authRequest(server.url, "/auth/password/reset", {})).response.status, 429);
    for (let index = 0; index < 30; index++) {
      assert.equal((await authRequest(server.url, index % 2 === 0 ? "/auth/refresh" : "/admin/auth/refresh", {})).response.status, 401);
    }
    assert.equal((await authRequest(server.url, "/admin/auth/refresh", {})).response.status, 429);
  } finally { await server.close(); }
});
