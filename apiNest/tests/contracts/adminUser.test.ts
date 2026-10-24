import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { comparePassword } from "@/modules/auth/security/hashPassword.js";
import { authRequest, refreshCookie, startAuthApplication } from "../harness/authApplication.js";
import { attachUserState } from "../fixtures/userState.js";

test("staff administration preserves DTOs, unique/FK errors and password session revocation", async () => {
  const server = await startAuthApplication();
  const fixture = attachUserState(server.state);
  const token = server.app.get(TokenService).signAdminAccessToken({ sub: server.state.user.id, email: server.state.user.email, role: "ADMIN", tokenType: "ADMIN" });
  const request = (path: string, method = "GET", body?: unknown) => authRequest(server.url, `/admin/users${path}`, body, { token, method });
  const payload = { fullName: " Nhân viên ", email: " STAFF@Test.local ", pw: "staff-password", pwConfirm: "staff-password", phone: "", avatar: "" };
  try {
    assert.equal((await request("", "POST", { ...payload, pwConfirm: "mismatch" })).response.status, 422);
    const created = await request("", "POST", payload);
    assert.equal(created.response.status, 201);
    assert.equal(created.body.message, "Tạo nhân viên thành công.");
    const item = created.body.data;
    assert.equal(item.email, "staff@test.local");
    assert.equal(item.fullName, "Nhân viên");
    assert.equal(item.role, "STAFF_ORDER");
    assert.equal(item.status, "ACTIVE");
    assert.equal(item.phone, null);
    assert.equal("passwordHash" in item, false);
    assert.equal(await comparePassword("staff-password", server.state.users.get(item.id)!.passwordHash), true);
    assert.equal((await request("", "POST", payload)).body.errorCode, "USER_UNIQUE_CONSTRAINT");
    assert.equal((await request(`/${item.id}`)).body.data.id, item.id);
    const updated = await request(`/${item.id}`, "PATCH", { fullName: "Tên đã sửa", avatar: "" });
    assert.equal(updated.body.data.fullName, "Tên đã sửa");
    assert.equal((await request(`/${item.id}`, "PATCH", {})).response.status, 422);
    const listed = await request("?page=2&limit=5&role=STAFF_ORDER&status=ACTIVE&search=%20staff%20");
    assert.deepEqual(listed.body.data.pagination, { page: 2, limit: 5, total: 2 });
    assert.equal(fixture.queries.at(-1)?.skip, 5);
    assert.deepEqual(fixture.queries.at(-1)?.where, { role: "STAFF_ORDER", status: "ACTIVE", OR: [{ fullName: { contains: "staff", mode: "insensitive" } }, { email: { contains: "staff", mode: "insensitive" } }] });
    const login = await authRequest(server.url, "/admin/auth/login", { email: item.email, password: "staff-password" });
    assert.equal(login.response.status, 200);
    const changed = await request(`/${item.id}/password`, "PATCH", { pw: "new-staff-password", pwConfirm: "new-staff-password" });
    assert.deepEqual(changed.body, { success: true, message: "Cập nhật mật khẩu thành công." });
    assert.equal(await comparePassword("new-staff-password", server.state.users.get(item.id)!.passwordHash), true);
    const refreshed = await authRequest(server.url, "/admin/auth/refresh", {}, { cookie: refreshCookie(login.response) });
    assert.equal(refreshed.body.errorCode, "REFRESH_TOKEN_INVALID");
    fixture.inUse.add(item.id);
    assert.equal((await request(`/${item.id}`, "DELETE")).body.errorCode, "USER_IN_USE");
    assert.equal(server.state.users.has(item.id), true);
    fixture.inUse.delete(item.id);
    assert.deepEqual((await request(`/${item.id}`, "DELETE")).body, { success: true, message: "Xóa nhân viên thành công." });
    assert.equal((await request(`/${item.id}`)).body.errorCode, "USER_NOT_FOUND");
  } finally { await server.close(); }
});

test("staff roles cannot access management and ADMIN cannot manage or grant administrator accounts", async () => {
  const server = await startAuthApplication();
  attachUserState(server.state);
  const token = server.app.get(TokenService).signAdminAccessToken({ sub: server.state.user.id, email: server.state.user.email, role: "SUPER_ADMIN", tokenType: "ADMIN" });
  const request = (path: string, method = "GET", body?: unknown) => authRequest(server.url, `/admin/users${path}`, body, { token, method });
  const payload = { fullName: "Staff", email: "other@test.local", pw: "staff-password", pwConfirm: "staff-password" };
  try {
    for (const role of ["STAFF_ORDER", "STAFF_CONTENT"] as const) {
      server.state.user.role = role;
      for (const [path, method, body] of [["", "GET", undefined], ["", "POST", payload], [`/${server.state.user.id}`, "GET", undefined], [`/${server.state.user.id}`, "PATCH", { fullName: "Denied" }], [`/${server.state.user.id}/password`, "PATCH", { pw: "password-123", pwConfirm: "password-123" }], [`/${server.state.user.id}`, "DELETE", undefined]] as const) {
        assert.equal((await request(path, method, body)).body.errorCode, "FORBIDDEN");
      }
    }
    server.state.user.role = "ADMIN";
    assert.equal((await request("", "POST", { ...payload, role: "ADMIN" })).body.errorCode, "FORBIDDEN_ADMIN_ROLE_MANAGEMENT");
    const staff = (await request("", "POST", payload)).body.data;
    assert.equal((await request(`/${staff.id}`, "PATCH", { role: "ADMIN" })).body.errorCode, "FORBIDDEN_ADMIN_ROLE_MANAGEMENT");
    for (const role of ["ADMIN", "SUPER_ADMIN"] as const) {
      server.state.users.get(staff.id)!.role = role;
      for (const [path, method, body] of [[`/${staff.id}`, "GET", undefined], [`/${staff.id}`, "PATCH", { fullName: "Denied" }], [`/${staff.id}/password`, "PATCH", { pw: "password-123", pwConfirm: "password-123" }], [`/${staff.id}`, "DELETE", undefined]] as const) {
        assert.equal((await request(path, method, body)).body.errorCode, "FORBIDDEN_ADMIN_ACCOUNT_MANAGEMENT");
      }
    }
    server.state.user.role = "SUPER_ADMIN";
    const allowed = await request(`/${staff.id}`, "PATCH", { role: "ADMIN" });
    assert.equal(allowed.response.status, 200);
    assert.equal(allowed.body.data.role, "ADMIN");
    assert.equal((await request("", "POST", { ...payload, email: "admin2@test.local", role: "ADMIN" })).response.status, 201);
    assert.equal((await request("", "POST", { ...payload, role: "SUPER_ADMIN" })).response.status, 422);
  } finally { await server.close(); }
});
