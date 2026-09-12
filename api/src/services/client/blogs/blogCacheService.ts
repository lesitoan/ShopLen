import { deleteCacheKeys, rememberJson } from "@/utils/redisCache.js";

const HOME_BLOG_POSTS_CACHE_KEY = "client:blog-posts:home:4";
const HOME_BLOG_POSTS_CACHE_TTL_SECONDS = 60 * 60 * 24;

export async function getCachedHomeBlogPosts<Value>(
  loadPosts: () => Promise<Value>,
): Promise<Value> {
  return rememberJson(
    HOME_BLOG_POSTS_CACHE_KEY,
    { ttlSeconds: HOME_BLOG_POSTS_CACHE_TTL_SECONDS, useLock: true },
    loadPosts,
  );
}

export async function invalidateHomeBlogPostsCache() {
  await deleteCacheKeys([HOME_BLOG_POSTS_CACHE_KEY]);
}
