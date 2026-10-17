import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { authRequest, refreshCookie, startAuthApplication } from "../harness/authApplication.js";
import { comparePassword } from "@/modules/auth/security/hashPassword.js";

test("customer profile preserves nullable dates, actor identity and password session revocation", async () => {
  const server = await startAuthApplication();
  try {
    const login = await authRequest(server.url, "/auth/login", { email: server.state.customer.email, password: "original-password" });
    const token = login.body.data.accessToken;
    const patch = (body: unknown) => authRequest(server.url, "/customers/me", body, { token, method: "PATCH" });
    assert.equal((await authRequest(server.url, "/customers/me")).response.status, 401);
    const updated = await patch({ fullName: " Tên mới ", birthday: "2000-02-29", gender: "OTHER", phone: "0123456789", id: server.state.user.id });
    assert.equal(updated.response.status, 200);
    assert.equal(updated.body.data.id, server.state.customer.id);
    assert.equal(updated.body.data.fullName, "Tên mới");
    assert.equal(updated.body.data.birthday, "2000-02-29");
    assert.equal("passwordHash" in updated.body.data, false);
    const cleared = await patch({ birthday: null, gender: null, phone: null });
    assert.equal(cleared.body.data.birthday, null);
    assert.equal(cleared.body.data.phone, null);
    const password = (body: unknown) => authRequest(server.url, "/customers/me/password", body, { token, method: "PATCH" });
    assert.equal((await password({ currentPassword: "wrong", newPassword: "changed-password", confirmPassword: "changed-password" })).body.errorCode, "INVALID_CREDENTIALS");
    assert.equal(await comparePassword("original-password", server.state.customer.passwordHash!), true);
    const changed = await password({ currentPassword: "original-password", newPassword: "changed-password", confirmPassword: "changed-password" });
    assert.deepEqual(changed.body, { success: true, message: "Cập nhật mật khẩu thành công." });
    assert.match(changed.response.headers.get("set-cookie") ?? "", /^refreshToken=;/);
    assert.equal(await comparePassword("changed-password", server.state.customer.passwordHash!), true);
    const refreshed = await authRequest(server.url, "/auth/refresh", {}, { cookie: refreshCookie(login.response) });
    assert.equal(refreshed.body.errorCode, "REFRESH_TOKEN_INVALID");
    server.state.customer.isManualLogin = false;
    const enabled = await password({ newPassword: "google-password", confirmPassword: "google-password" });
    assert.equal(enabled.response.status, 200);
    assert.equal(server.state.customer.isManualLogin, true);
  } finally { await server.close(); }
});

test("avatar enforces multipart field, MIME and 2MB before uploading and preserves empty success data", async () => {
  const server = await startAuthApplication();
  try {
    const login = await authRequest(server.url, "/auth/login", { email: server.state.customer.email, password: "original-password" });
    const token = login.body.data.accessToken;
    const upload = async (mime: string, size: number, field = "avatar", authorized = true) => {
      const form = new FormData();
      if (field) form.append(field, new Blob([new Uint8Array(size)], { type: mime }), "avatar.webp");
      const response = await fetch(`${server.url}/api/v1/customers/me/avatar`, {
        method: "PATCH", headers: authorized ? { Authorization: `Bearer ${token}` } : {}, body: form,
      });
      return { response, body: await response.json() };
    };
    assert.equal((await upload("image/png", 1, "avatar", false)).response.status, 401);
    assert.equal((await upload("image/gif", 1)).body.errorCode, "AVATAR_FILE_TYPE_INVALID");
    assert.equal((await upload("image/png", 1, "image")).body.errorCode, "LIMIT_UNEXPECTED_FILE");
    assert.equal((await upload("image/png", 2 * 1024 * 1024 + 1)).body.errorCode, "LIMIT_FILE_SIZE");
    assert.equal((await upload("image/png", 0, "")).body.errorCode, "AVATAR_FILE_REQUIRED");
    assert.equal(server.uploads.length, 0);
    const result = await upload("image/webp", 2 * 1024 * 1024 - 1);
    assert.equal(result.response.status, 200);
    assert.deepEqual(result.body, { success: true, message: "Cập nhật avatar thành công." });
    assert.equal(server.uploads[0]?.folder, "avatars");
    assert.equal(server.uploads[0]?.file.buffer.length, 2 * 1024 * 1024 - 1);
    assert.equal(server.state.customer.avatar, "https://example.test/avatar.webp");
  } finally { await server.close(); }
});
