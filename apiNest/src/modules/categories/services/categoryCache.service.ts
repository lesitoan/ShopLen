import { Inject, Injectable } from "@nestjs/common";
import { RedisCacheService } from "@/infrastructure/cache/redisCache.service.js";

@Injectable()
export class CategoryCacheService {
  constructor(@Inject(RedisCacheService) private readonly cache: RedisCacheService) {}

  getCachedCategories<Value>(loader: () => Promise<Value>) {
    return this.cache.rememberJson("client:categories", { ttlSeconds: 60 * 60 * 24, useLock: true }, loader);
  }

  invalidateCategoryCache() {
    return this.cache.deleteCacheKeys(["client:categories"]);
  }
}
