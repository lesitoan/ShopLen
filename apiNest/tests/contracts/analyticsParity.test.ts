import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { startAuthApplication, authRequest } from "../harness/authApplication.js";
import { startLegacyServer } from "../harness/contractHarness.js";
import { createAnalyticsState } from "../fixtures/analyticsState.js";

test("five analytics routes preserve HTTP contracts, date buckets, validation and ranking fallback", async (context) => {
  context.mock.timers.enable({ apis: ["Date"], now: new Date("2026-10-25T07:00:00.000Z") });
  const state = await createAnalyticsState();
  const nest = await startAuthApplication(async () => state);
  let legacy: Awaited<ReturnType<typeof startLegacyServer>> | undefined;
  try {
    legacy = await startLegacyServer("legacyAnalyticsServer.mjs");
    const token = nest.app.get(TokenService).signAdminAccessToken({ sub: state.user.id, email: state.user.email, role: "ADMIN", tokenType: "ADMIN" });
    for (const path of [
      "/admin/dashboard/overview", "/admin/amalytics/dashboard/summary",
      "/admin/amalytics/dashboard/revenue?startDate=2026-10-25&endDate=2026-10-25",
      "/admin/amalytics/dashboard/revenue?startDate=2026-10-24&endDate=2026-10-25",
      "/admin/amalytics/dashboard/revenue?startDate=2026-10-01&endDate=2026-10-31",
      "/admin/amalytics/dashboard/revenue?startDate=2026-10-01&endDate=2026-11-01",
      "/admin/amalytics/dashboard/revenue?startDate=2026-10-25&endDate=2026-10-24",
      "/admin/amalytics/dashboard/revenue?startDate=bad",
      "/admin/amalytics/dashboard/top-products",
      "/admin/amalytics/dashboard/top-products?startDate=2026-01-01&endDate=2026-01-02",
      "/admin/amalytics/dashboard/low-stock?threshold=0&limit=1",
      "/admin/amalytics/dashboard/low-stock?threshold=-1",
    ]) {
      const expected = await authRequest(legacy.url, path, undefined, { token });
      const actual = await authRequest(nest.url, path, undefined, { token });
      assert.equal(actual.response.status, expected.response.status, path);
      assert.deepEqual(actual.body, expected.body, path);
      if (path.endsWith("endDate=2026-10-25")) assert.equal(actual.body.data.points.length, path.includes("startDate=2026-10-25") ? 24 : 2);
    }
    state.user.role = "STAFF_ORDER";
    assert.equal((await authRequest(nest.url, "/admin/dashboard/overview", undefined, { token })).response.status, 200);
    assert.equal((await authRequest(nest.url, "/admin/amalytics/dashboard/summary", undefined, { token })).response.status, 403);
    assert.equal((await authRequest(nest.url, "/admin/dashboard/overview")).response.status, 401);
    assert.ok(state.calls.some((call) => call.model === "groupBy"));
  } finally { await legacy?.close(); await nest.close(); }
});
