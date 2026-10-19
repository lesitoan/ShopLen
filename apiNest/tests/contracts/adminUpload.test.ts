import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { startAuthApplication } from "../harness/authApplication.js";

test("admin uploads preserve target permissions, validation order, fields, size/count limits and folders", async () => {
  const server = await startAuthApplication();
  const token = server.app.get(TokenService).signAdminAccessToken({ sub: server.state.user.id, email: server.state.user.email, role: "ADMIN", tokenType: "ADMIN" });
  const upload = async (target: string, options: { many?: boolean; field?: string; mime?: string; size?: number; count?: number; authorized?: boolean } = {}) => {
    const form = new FormData();
    for (let i = 0; i < (options.count ?? 1); i++) form.append(options.field ?? (options.many ? "images" : "image"), new Blob([new Uint8Array(options.size ?? 1)], { type: options.mime ?? "image/png" }), `image-${i}.png`);
    const response = await fetch(`${server.url}/api/v1/admin/upload/images${options.many ? "/many" : ""}?target=${target}`, { method: "POST", headers: options.authorized === false ? {} : { Authorization: `Bearer ${token}` }, body: form });
    return { response, body: await response.json() };
  };
  try {
    assert.equal((await upload("INVALID", { mime: "image/gif", authorized: false })).response.status, 401);
    server.state.user.role = "STAFF_ORDER";
    assert.equal((await upload("INVALID", { mime: "image/gif" })).body.errorCode, "FORBIDDEN");
    server.state.user.role = "STAFF_CONTENT";
    assert.equal((await upload("INVALID", { mime: "image/gif" })).body.errorCode, "VALIDATION_ERROR");
    assert.equal((await upload("CATEGORY", { mime: "image/gif" })).body.errorCode, "ADMIN_IMAGE_FILE_TYPE_INVALID");
    for (const target of ["CATEGORY", "PRODUCT", "USER_AVATAR"]) assert.equal((await upload(target)).body.errorCode, "UPLOAD_TARGET_FORBIDDEN");
    assert.equal((await upload("BLOG", { count: 0 })).body.errorCode, "IMAGE_REQUIRED");
    assert.equal((await upload("BLOG", { field: "avatar" })).body.errorCode, "LIMIT_UNEXPECTED_FILE");
    assert.equal((await upload("BLOG", { many: true, count: 7 })).body.errorCode, "LIMIT_FILE_COUNT");
    assert.equal((await upload("BLOG", { count: 2 })).body.errorCode, "LIMIT_FILE_COUNT");
    const oversized = await upload("BLOG", { size: 5 * 1024 * 1024 });
    assert.equal(oversized.body.errorCode, "LIMIT_FILE_SIZE");
    assert.equal(oversized.body.message, "File avatar không được vượt quá 2MB.");
    assert.equal(server.uploads.length, 0);
    const single = await upload("BLOG", { size: 5 * 1024 * 1024 - 1, mime: "image/webp" });
    assert.equal(single.response.status, 201);
    assert.deepEqual(single.body, { success: true, message: "Tải ảnh lên thành công.", data: { url: "https://example.test/avatar.webp", publicId: "avatars/test" } });
    assert.equal(server.uploads.at(-1)?.folder, "blog");
    assert.equal(server.uploads.at(-1)?.file.buffer.length, 5 * 1024 * 1024 - 1);
    const many = await upload("BLOG", { many: true, count: 6 });
    assert.equal(many.response.status, 201);
    assert.equal(many.body.data.length, 6);
    assert.deepEqual(server.uploads.slice(-6).map(({ file }) => file.originalname), Array.from({ length: 6 }, (_, i) => `image-${i}.png`));
    server.state.user.role = "ADMIN";
    for (const [target, folder] of [["CATEGORY", "categories"], ["PRODUCT", "products"], ["USER_AVATAR", "users/avatars"]]) {
      assert.equal((await upload(target!, { mime: "image/jpeg" })).response.status, 201);
      assert.equal(server.uploads.at(-1)?.folder, folder);
    }
  } finally { await server.close(); }
});
