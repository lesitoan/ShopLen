import { deleteCacheKeys, rememberJson } from "@/utils/redisCache.js";

const CATEGORY_CACHE_KEY = "client:categories";
const CATEGORY_CACHE_TTL_SECONDS = 60 * 60 * 24;

export async function getCachedCategories<Value>(
  loadCategories: () => Promise<Value>,
): Promise<Value> {
  return rememberJson(
    CATEGORY_CACHE_KEY,
    { ttlSeconds: CATEGORY_CACHE_TTL_SECONDS, useLock: true },
    loadCategories,
  );
}

export async function invalidateCategoryCache() {
  await deleteCacheKeys([CATEGORY_CACHE_KEY]);
}
