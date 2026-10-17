import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { startAuthApplication } from "../harness/authApplication.js";
import { startLegacyServer } from "../harness/contractHarness.js";
import { createAccountParityState } from "../fixtures/accountParityState.js";

test("all 17 account endpoints preserve Express HTTP contracts on independent equivalent fixtures", async () => {
  const nest = await startAuthApplication(createAccountParityState);
  let legacy: Awaited<ReturnType<typeof startLegacyServer>> | undefined;
  try {
    legacy = await startLegacyServer("legacyAccountServer.mjs");
    const tokens = nest.app.get(TokenService);
    const customerToken = tokens.signCustomerAccessToken({ sub: nest.state.customer.id, email: nest.state.customer.email, tokenType: "CUSTOMER" });
    const adminToken = tokens.signAdminAccessToken({ sub: nest.state.user.id, email: nest.state.user.email, role: "ADMIN", tokenType: "ADMIN" });
    const visited = new Set<string>();
    const compare = async (method: string, path: string, input?: unknown, multipart?: { field: string; mime: string; size: number }) => {
      const results = [];
      for (const url of [legacy!.url, nest.url]) {
        const headers: Record<string, string> = { Authorization: `Bearer ${path.startsWith("/admin") ? adminToken : customerToken}` };
        let body: FormData | string | undefined;
        if (multipart) {
          body = new FormData();
          body.append(multipart.field, new Blob([new Uint8Array(multipart.size)], { type: multipart.mime }), "avatar.png");
        } else if (input !== undefined) {
          headers["Content-Type"] = "application/json";
          body = JSON.stringify(input);
        }
        const response = await fetch(`${url}/api/v1${path}`, { method, headers, body });
        results.push({ status: response.status, body: await response.json(), contentType: response.headers.get("content-type") });
      }
      assert.deepEqual(results[1], results[0], `${method} ${path}`);
      visited.add(`${method} ${path.split("?")[0]!.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ":id")}`);
      return results[1]!;
    };
    await compare("GET", "/customers/me");
    await compare("PATCH", "/customers/me", { birthday: "2000-02-29", phone: null, fullName: " Khách cập nhật " });
    await compare("PATCH", "/customers/me", { birthday: "invalid" });
    await compare("PATCH", "/customers/me/avatar", undefined, { field: "avatar", mime: "image/png", size: 100 });
    await compare("PATCH", "/customers/me/avatar", undefined, { field: "image", mime: "image/png", size: 1 });
    await compare("PATCH", "/customers/me/avatar", undefined, { field: "avatar", mime: "image/gif", size: 1 });
    await compare("PATCH", "/customers/me/avatar", undefined, { field: "avatar", mime: "image/png", size: 2 * 1024 * 1024 });
    await compare("PATCH", "/customers/me/password", { currentPassword: "wrong", newPassword: "password-123", confirmPassword: "password-123" });
    await compare("PATCH", "/customers/me/password", { currentPassword: "original-password", newPassword: "password-123", confirmPassword: "password-123" });
    const address = { fullName: "Khách", phone: "0123456789", provinceName: "HCM", addressLine: "Địa chỉ" };
    await compare("POST", "/addresses", address);
    const list = await compare("GET", "/addresses");
    const addressId = list.body.data[0].id;
    await compare("PATCH", `/addresses/${addressId}`, { isDefault: false, addressLine: "Không thay đổi" });
    await compare("DELETE", `/addresses/${addressId}`);
    await compare("GET", "/admin/customers?page=1&limit=5&search=%20%20");
    await compare("GET", `/admin/customers/${nest.state.customer.id}`);
    await compare("PATCH", `/admin/customers/${nest.state.customer.id}/status`, { status: "LOCKED" });
    await compare("GET", "/customers/me");
    await compare("GET", "/admin/users");
    const created = await compare("POST", "/admin/users", { code: "USR_PARITY", fullName: "Staff", email: "staff@test.local", pw: "staff-password", pwConfirm: "staff-password" });
    const userId = created.body.data.id;
    await compare("GET", `/admin/users/${userId}`);
    await compare("PATCH", `/admin/users/${userId}`, { phone: "", role: "STAFF_CONTENT" });
    await compare("PATCH", `/admin/users/${userId}/password`, { pw: "password-123", pwConfirm: "password-123" });
    await compare("DELETE", `/admin/users/${userId}`);
    assert.equal(visited.size, 17);
  } finally {
    await legacy?.close();
    await nest.close();
  }
});
