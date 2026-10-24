import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { startAuthApplication } from "../harness/authApplication.js";
import { startLegacyServer } from "../harness/contractHarness.js";
import { createBlogState } from "../fixtures/blogState.js";

test("all 16 blog/upload endpoints preserve Express responses, cache headers and multipart error precedence", async (context) => {
  context.mock.timers.enable({ apis: ["Date"], now: new Date("2026-10-24T14:00:00.000Z") });
  const state = await createBlogState();
  state.user.role = "STAFF_CONTENT";
  const nest = await startAuthApplication(async () => state);
  let legacy: Awaited<ReturnType<typeof startLegacyServer>> | undefined;
  try {
    legacy = await startLegacyServer("legacyBlogServer.mjs");
    const token = nest.app.get(TokenService).signAdminAccessToken({ sub: state.user.id, email: state.user.email, role: "STAFF_CONTENT", tokenType: "ADMIN" });
    const visited = new Set<string>();
    const compare = async (method: string, path: string, input?: unknown, upload?: { field: string; mime?: string; count?: number; size?: number }) => {
      const results = [];
      for (const url of [legacy!.url, nest.url]) {
        const headers: Record<string, string> = path.startsWith("/admin") ? { Authorization: `Bearer ${token}` } : {};
        let body: string | FormData | undefined;
        if (upload) {
          body = new FormData();
          for (let i = 0; i < (upload.count ?? 1); i++) body.append(upload.field, new Blob([new Uint8Array(upload.size ?? 1)], { type: upload.mime ?? "image/png" }), `image-${i}.png`);
        } else if (input !== undefined) { headers["Content-Type"] = "application/json"; body = JSON.stringify(input); }
        const response = await fetch(`${url}/api/v1${path}`, { method, headers, body });
        results.push({ status: response.status, body: await response.json(), cache: response.headers.get("cache-control"), type: response.headers.get("content-type") });
      }
      assert.deepEqual(results[1], results[0], `${method} ${path}`);
      let route = path.split("?")[0]!.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ":id");
      if (route.startsWith("/blog/posts/") && route !== "/blog/posts/featured") route = "/blog/posts/:slug";
      visited.add(`${method} ${route}`);
      return results[1]!;
    };
    await compare("GET", "/blog/tags");
    await compare("GET", "/blog/posts?home=true&limit=4");
    await compare("GET", "/blog/posts?home=invalid");
    await compare("GET", "/blog/posts/featured");
    await compare("GET", "/blog/posts/published");
    await compare("GET", "/blog/posts/missing");
    await compare("GET", "/admin/blog/tags");
    const tag = await compare("POST", "/admin/blog/tags", { name: "Parity Topic" });
    await compare("PATCH", `/admin/blog/tags/${tag.body.data.id}`, { name: "Updated Topic" });
    await compare("DELETE", `/admin/blog/tags/${tag.body.data.id}`);
    await compare("DELETE", `/admin/blog/tags/${state.activeTag.id}`);
    await compare("GET", "/admin/blog/posts?sort=VIEWS_DESC&limit=3");
    const post = await compare("POST", "/admin/blog/posts", { title: "Parity Blog", slug: "parity-blog", excerpt: "Excerpt", contentHtml: "<p>Body</p>", tagId: "missing", thumbnailUrl: "https://example.test/thumb.png" });
    const id = post.body.data.id;
    await compare("GET", `/admin/blog/posts/${id}`);
    await compare("PATCH", `/admin/blog/posts/${id}`, { title: "Updated", thumbnailUrl: "https://example.test/replaced.png", isFeatured: true, showOnHome: true });
    await compare("PATCH", `/admin/blog/posts/${id}/status`, { status: "PUBLISHED" });
    await compare("DELETE", `/admin/blog/posts/${id}`);
    await compare("PATCH", `/admin/blog/posts/${state.published.id}/status`, { status: "HIDDEN" });
    await compare("GET", "/blog/posts/featured");
    await compare("POST", "/admin/upload/images?target=INVALID", undefined, { field: "image", mime: "image/gif" });
    await compare("POST", "/admin/upload/images?target=CATEGORY", undefined, { field: "image" });
    await compare("POST", "/admin/upload/images?target=BLOG", undefined, { field: "image" });
    await compare("POST", "/admin/upload/images?target=BLOG", undefined, { field: "image", size: 5 * 1024 * 1024 });
    await compare("POST", "/admin/upload/images/many?target=BLOG", undefined, { field: "images", count: 6 });
    await compare("POST", "/admin/upload/images/many?target=BLOG", undefined, { field: "images", count: 7 });
    assert.equal(visited.size, 16);
  } finally { await legacy?.close(); await nest.close(); }
});
