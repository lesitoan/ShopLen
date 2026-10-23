import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { authRequest, refreshCookie, startAuthApplication } from "../harness/authApplication.js";

test("customer auth protects refresh rotation, account state and OTP password recovery", async () => {
  const server = await startAuthApplication();
  const request: typeof authRequest = async (...args) => { server.resetLimits(); return authRequest(...args); };
  try {
    const registered = await request(server.url, "/auth/register", { email: " NEW@Test.local ", password: "password-123", confirmPassword: "password-123" });
    assert.equal(registered.response.status, 201);
    assert.deepEqual(Object.keys(registered.body.data), ["accessToken"]);
    assert.equal(registered.body.message, "Đăng ký thành công.");
    const cookieHeader = registered.response.headers.get("set-cookie") ?? "";
    assert.match(cookieHeader, /^refreshToken=/);
    assert.match(cookieHeader, /Path=\/api\/v1\/auth/);
    assert.match(cookieHeader, /HttpOnly/);
    assert.match(cookieHeader, /SameSite=Lax/);
    assert.match(cookieHeader, /Max-Age=2592000/);
    assert.equal(cookieHeader.includes("Secure"), false);
    assert.equal(server.state.notifications.length, 1);
    const duplicate = await request(server.url, "/auth/register", { email: "new@test.local", password: "password-123", confirmPassword: "password-123" });
    assert.equal(duplicate.response.status, 409);
    assert.equal(duplicate.body.errorCode, "EMAIL_ALREADY_EXISTS");

    const loggedIn = await request(server.url, "/auth/login", { email: server.state.customer.email, password: "original-password" });
    assert.equal(loggedIn.response.status, 200);
    const token = loggedIn.body.data.accessToken;
    const cookie = refreshCookie(loggedIn.response);
    const me = await request(server.url, "/auth/me", undefined, { token });
    assert.equal(me.response.status, 200);
    assert.equal(me.body.data.id, server.state.customer.id);
    const adminLogin = await request(server.url, "/admin/auth/login", { email: server.state.user.email, password: "original-password" });
    assert.equal((await request(server.url, "/auth/me", undefined, { token: adminLogin.body.data.accessToken })).response.status, 401);
    assert.equal("passwordHash" in me.body.data, false);
    assert.equal((await request(server.url, "/auth/me")).response.status, 401);
    assert.equal((await request(server.url, "/auth/login", { email: server.state.customer.email, password: "wrong" })).response.status, 401);
    server.state.customer.status = "LOCKED";
    assert.equal((await request(server.url, "/auth/me", undefined, { token })).body.errorCode, "CUSTOMER_LOCKED");
    assert.equal((await request(server.url, "/auth/login", { email: server.state.customer.email, password: "original-password" })).response.status, 403);
    server.state.customer.status = "ACTIVE";

    const missingCookie = await request(server.url, "/auth/refresh", { refreshToken: cookie.split("=")[1] });
    assert.equal(missingCookie.response.status, 401);
    const rotated = await request(server.url, "/auth/refresh", {}, { cookie });
    assert.equal(rotated.response.status, 200);
    assert.notEqual(refreshCookie(rotated.response), cookie);
    assert.equal((await request(server.url, "/auth/refresh", {}, { cookie })).body.errorCode, "REFRESH_TOKEN_INVALID");

    const google = await request(server.url, "/auth/google", { idToken: "new-google" });
    assert.equal(google.response.status, 200);
    assert.equal(google.body.message, "Đăng nhập Google thành công.");
    assert.equal(server.state.notifications.length, 2);
    assert.equal((await request(server.url, "/auth/google", { idToken: "unverified" })).body.errorCode, "GOOGLE_EMAIL_NOT_VERIFIED");
    assert.equal((await request(server.url, "/auth/google", { idToken: "invalid" })).body.errorCode, "GOOGLE_TOKEN_INVALID");

    const missing = await request(server.url, "/auth/password/forgot", { email: "missing@test.local" });
    assert.equal(missing.response.status, 200);
    assert.deepEqual(missing.body.data, {});
    assert.equal(server.state.emails.length, 0);
    const forgot = await request(server.url, "/auth/password/forgot", { email: server.state.customer.email });
    assert.equal(forgot.response.status, 200);
    const otpCode = forgot.body.data.devOtp;
    assert.match(otpCode, /^\d{6}$/);
    assert.equal(server.state.emails[0].otpCode, otpCode);
    const wrongOtp = otpCode === "000000" ? "111111" : "000000";
    assert.equal((await request(server.url, "/auth/password/otp/verify", { email: server.state.customer.email, otpCode: wrongOtp })).body.errorCode, "OTP_INVALID");
    const verified = await request(server.url, "/auth/password/otp/verify", { email: server.state.customer.email, otpCode });
    assert.deepEqual(verified.body.data, { verified: true });
    const reset = await request(server.url, "/auth/password/reset", {
      email: server.state.customer.email, otpCode, newPassword: "changed-password", confirmPassword: "changed-password",
    });
    assert.equal(reset.response.status, 200);
    assert.deepEqual(reset.body.data, { reset: true });
    assert.match(reset.response.headers.get("set-cookie") ?? "", /^refreshToken=;/);
    assert.equal((await request(server.url, "/auth/refresh", {}, { cookie: refreshCookie(rotated.response) })).body.errorCode, "REFRESH_TOKEN_INVALID");
    assert.equal((await request(server.url, "/auth/password/reset", {
      email: server.state.customer.email, otpCode, newPassword: "changed-again", confirmPassword: "changed-again",
    })).body.errorCode, "OTP_INVALID");
    const newLogin = await request(server.url, "/auth/login", { email: server.state.customer.email, password: "changed-password" });
    assert.equal(newLogin.response.status, 200);
    const newCookie = refreshCookie(newLogin.response);
    const logout = await request(server.url, "/auth/logout", {}, { cookie: newCookie });
    assert.deepEqual(logout.body, { success: true, message: "Đăng xuất thành công.", data: { loggedOut: true } });
    assert.match(logout.response.headers.get("set-cookie") ?? "", /Max-Age=2592000/);
    assert.equal((await request(server.url, "/auth/logout", {}, { cookie: newCookie })).response.status, 200);
    assert.equal((await request(server.url, "/auth/refresh", {}, { cookie: newCookie })).body.errorCode, "REFRESH_TOKEN_INVALID");
  } finally { await server.close(); }
});
