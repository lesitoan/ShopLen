import { Inject, Injectable } from "@nestjs/common";
import { RedisCacheService } from "@/infrastructure/cache/redisCache.service.js";

@Injectable()
export class BlogCacheService {
  constructor(@Inject(RedisCacheService) private readonly cache: RedisCacheService) {}

  getCachedHomeBlogPosts<Value>(loader: () => Promise<Value>) {
    return this.cache.rememberJson("client:blog-posts:home:4", { ttlSeconds: 86400, useLock: true }, loader);
  }

  invalidateHomeBlogPostsCache() {
    return this.cache.deleteCacheKeys(["client:blog-posts:home:4"]);
  }
}
