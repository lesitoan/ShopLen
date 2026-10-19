import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";
import { createBlogState } from "../fixtures/blogState.js";

test("public blog enforces visibility, special null/404 responses, home cache and asynchronous view counting", async () => {
  const state = await createBlogState();
  const server = await startAuthApplication(async () => state);
  try {
    const tags = await authRequest(server.url, "/blog/tags");
    assert.deepEqual(tags.body.data.map((tag: { id: string }) => tag.id), [state.activeTag.id]);
    const home = await authRequest(server.url, "/blog/posts?home=1&limit=4");
    assert.deepEqual(home.body.data.items.map((post: { id: string }) => post.id), [state.published.id]);
    assert.deepEqual(home.body.data.pagination, { page: 1, limit: 4, totalItems: 1, totalPages: 1 });
    assert.equal(home.response.headers.get("cache-control"), "public, max-age=300, s-maxage=86400, stale-while-revalidate=86400");
    assert.equal(await state.redis.ttl("client:blog-posts:home:4"), 86400);
    const before = state.queries.length;
    await authRequest(server.url, "/blog/posts?home=true&limit=4");
    assert.equal(state.queries.length, before);
    const filtered = await authRequest(server.url, `/blog/posts?home=true&limit=4&tag=${state.activeTag.slug}`);
    assert.equal(filtered.response.headers.get("cache-control"), null);
    assert.ok(state.queries.length > before);
    for (const slug of ["draft", "hidden", "future", "deleted", "inactive-tag", "undated", "missing"]) {
      const response = await authRequest(server.url, `/blog/posts/${slug}`);
      assert.equal(response.response.status, 404);
      assert.deepEqual(response.body, { success: false, message: "Không tìm thấy bài viết.", data: null });
    }
    assert.equal((await authRequest(server.url, "/blog/posts/featured")).body.data.id, state.published.id);
    state.published.isFeatured = false;
    assert.deepEqual((await authRequest(server.url, "/blog/posts/featured")).body, { success: true, message: "Thanh cong.", data: null });
    state.user.fullName = "";
    state.published.images = [{ id: "image-fallback", url: "https://example.test/fallback.png", altText: null, displayOrder: 0, createdAt: new Date(), isThumbnail: false }];
    const detail = await authRequest(server.url, "/blog/posts/published");
    assert.equal(detail.body.data.author, "Tiệm Len Nhà Kiều");
    assert.equal(detail.body.data.authorAvatar, "/logo.png");
    assert.equal(detail.body.data.thumbnail.id, "image-fallback");
    assert.equal(state.published.viewCount, 1);
    state.failure.viewCount = true;
    assert.equal((await authRequest(server.url, "/blog/posts/published")).response.status, 200);
    assert.equal((await authRequest(server.url, "/blog/posts?home=bad")).response.status, 422);
  } finally { await server.close(); }
});
