import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { authRequest, refreshCookie, startAuthApplication } from "../harness/authApplication.js";

test("admin auth keeps cookie scope, one session, rotation and actor separation", async () => {
  const server = await startAuthApplication();
  const request: typeof authRequest = async (...args) => { server.resetLimits(); return authRequest(...args); };
  try {
    const loggedIn = await request(server.url, "/admin/auth/login", { email: server.state.user.email, password: "original-password" });
    assert.equal(loggedIn.response.status, 200);
    assert.match(loggedIn.response.headers.get("set-cookie") ?? "", /^adminRefreshToken=.*Path=\/api\/v1\/admin\/auth/);
    assert.deepEqual(Object.keys(loggedIn.body.data), ["accessToken"]);
    const token = loggedIn.body.data.accessToken;
    const me = await request(server.url, "/admin/auth/me", undefined, { token });
    assert.equal(me.body.data.role, "ADMIN");
    server.state.user.role = "STAFF_ORDER";
    assert.equal((await request(server.url, "/admin/auth/me", undefined, { token })).body.data.role, "STAFF_ORDER");
    server.state.user.role = "ADMIN";
    assert.equal("passwordHash" in me.body.data, false);
    const customerToken = server.app.get(TokenService).signCustomerAccessToken({
      sub: server.state.customer.id, email: server.state.customer.email, tokenType: "CUSTOMER",
    });
    assert.equal((await request(server.url, "/admin/auth/me", undefined, { token: customerToken })).response.status, 401);
    server.state.user.status = "LOCKED";
    assert.equal((await request(server.url, "/admin/auth/me", undefined, { token })).body.errorCode, "USER_LOCKED");
    assert.equal((await request(server.url, "/admin/auth/login", { email: server.state.user.email, password: "original-password" })).response.status, 403);
    server.state.user.status = "ACTIVE";
    const cookie = refreshCookie(loggedIn.response);
    assert.equal((await request(server.url, "/admin/auth/refresh", { refreshToken: cookie.split("=")[1] })).response.status, 401);
    const rotated = await request(server.url, "/admin/auth/refresh", {}, { cookie });
    assert.equal(rotated.response.status, 200);
    assert.equal((await request(server.url, "/admin/auth/refresh", {}, { cookie })).body.errorCode, "REFRESH_TOKEN_INVALID");
    const second = await request(server.url, "/admin/auth/login", { email: server.state.user.email, password: "original-password" });
    assert.equal((await request(server.url, "/admin/auth/refresh", {}, { cookie: refreshCookie(rotated.response) })).response.status, 401);
    const logout = await request(server.url, "/admin/auth/logout", {}, { cookie: refreshCookie(second.response) });
    assert.deepEqual(logout.body.data, { loggedOut: true });
    assert.equal((await request(server.url, "/admin/auth/logout", {})).response.status, 200);
  } finally { await server.close(); }
});
