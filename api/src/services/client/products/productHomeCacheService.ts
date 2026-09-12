import { HOME_PRODUCT_SECTION_TYPES } from "@/types/product.type.js";
import type { HomeProductSectionType } from "@/types/product.type.js";
import { deleteCacheKeys, rememberJson } from "@/utils/redisCache.js";

const CACHE_KEY_PREFIX = "home:products";
const CACHE_TTL_SECONDS = 600;
export async function getCachedHomeProductSections<Value>(
  types: HomeProductSectionType[],
  loadSection: (type: HomeProductSectionType) => Promise<Value>,
) {
  return Promise.all(
    types.map((type) =>
      rememberJson(
        `${CACHE_KEY_PREFIX}:${type}`,
        { ttlSeconds: CACHE_TTL_SECONDS, useLock: true },
        () => loadSection(type),
      ),
    ),
  );
}

export async function invalidateHomeProductCache() {
  await deleteCacheKeys(
    HOME_PRODUCT_SECTION_TYPES.map((type) => `${CACHE_KEY_PREFIX}:${type}`),
  );
}
