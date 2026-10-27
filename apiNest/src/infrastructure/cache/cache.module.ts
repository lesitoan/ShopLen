import { Module } from "@nestjs/common";
import { RedisModule } from "@/infrastructure/redis/redis.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { RedisCacheService } from "@/infrastructure/cache/redisCache.service.js";

@Module({
  imports: [RedisModule, LoggingModule],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class CacheModule {}
