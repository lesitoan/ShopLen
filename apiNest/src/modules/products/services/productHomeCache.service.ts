import { Inject, Injectable } from "@nestjs/common";
import { RedisCacheService } from "@/infrastructure/cache/redisCache.service.js";
import {
  HOME_PRODUCT_SECTION_TYPES,
  type HomeProductSectionType,
} from "@/modules/products/types/product.type.js";

@Injectable()
export class ProductHomeCacheService {
  constructor(
    @Inject(RedisCacheService) private readonly cache: RedisCacheService,
  ) {}

  getCachedHomeProductSections<Value>(
    types: HomeProductSectionType[],
    loadSection: (type: HomeProductSectionType) => Promise<Value>,
  ) {
    return Promise.all(
      types.map((type) =>
        this.cache.rememberJson(
          `home:products:${type}`,
          { ttlSeconds: 600, useLock: true },
          () => loadSection(type),
        ),
      ),
    );
  }

  invalidateHomeProductCache() {
    return this.cache.deleteCacheKeys(
      HOME_PRODUCT_SECTION_TYPES.map((type) => `home:products:${type}`),
    );
  }
}
