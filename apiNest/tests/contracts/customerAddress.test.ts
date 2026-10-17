import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";
import { createAddressState } from "../fixtures/addressState.js";

test("addresses preserve first default, owner isolation, PATCH scope and mutation responses", async () => {
  const server = await startAuthApplication();
  const fixture = createAddressState();
  Object.assign(server.state.prisma, fixture.prisma);
  const token = server.app.get(TokenService).signCustomerAccessToken({ sub: server.state.customer.id, email: server.state.customer.email, tokenType: "CUSTOMER" });
  const request = (path: string, method: string, body?: unknown) => authRequest(server.url, path, body, { token, method });
  const input = { fullName: "Khách hàng", phone: "0123456789", provinceName: "TP HCM", addressLine: "Địa chỉ thử nghiệm" };
  try {
    const created = await request("/addresses", "POST", { ...input, customerId: server.state.user.id });
    assert.equal(created.response.status, 200);
    assert.deepEqual(created.body, { success: true, message: "Thêm địa chỉ thành công." });
    const first = [...fixture.addresses.values()][0]!;
    assert.equal(first.customerId, server.state.customer.id);
    assert.equal(first.isDefault, true);
    await request("/addresses", "POST", { ...input, isDefault: true });
    const second = [...fixture.addresses.values()][1]!;
    assert.equal(first.isDefault, false);
    assert.equal(second.isDefault, true);
    const updated = await request(`/addresses/${first.id}`, "PATCH", { isDefault: true, fullName: "Không được thay đổi" });
    assert.deepEqual(updated.body, { success: true, message: "Cập nhật địa chỉ thành công." });
    assert.equal(first.fullName, input.fullName);
    assert.equal(first.isDefault, true);
    assert.equal(second.isDefault, false);
    const listed = await request("/addresses", "GET");
    assert.equal(listed.body.data[0].id, first.id);
    assert.equal("customerId" in listed.body.data[0], false);
    second.customerId = server.state.user.id;
    for (const method of ["PATCH", "DELETE"]) {
      const forbidden = await request(`/addresses/${second.id}`, method, method === "PATCH" ? { isDefault: true } : undefined);
      assert.equal(forbidden.response.status, 404);
      assert.equal(forbidden.body.errorCode, "CUSTOMER_ADDRESS_NOT_FOUND");
    }
    assert.equal(fixture.addresses.has(second.id), true);
    assert.equal((await request(`/addresses/${first.id}`, "PATCH", { fullName: "Thiếu isDefault" })).response.status, 422);
    const deleted = await request(`/addresses/${first.id}`, "DELETE");
    assert.deepEqual(deleted.body, { success: true, message: "Xóa địa chỉ thành công." });
    assert.equal(fixture.addresses.has(first.id), false);
  } finally { await server.close(); }
});
