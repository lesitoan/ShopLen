import { Inject, Injectable } from "@nestjs/common";
import { RedisService } from "@/infrastructure/redis/redis.service.js";
import type { RememberJsonOptions } from "@/infrastructure/cache/types/redisCache.type.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(RedisService) private readonly redis: RedisService,
    @Inject(LoggingService) private readonly logging: LoggingService,
  ) {}
  private async readJson<Value>(key: string): Promise<Value | undefined> {
    try {
      const redis = await this.redis.getClient();
      const rawValue = await redis.get(key);

      if (!rawValue) {
        return undefined;
      }

      try {
        return JSON.parse(rawValue) as Value;
      } catch {
        await redis.del(key);
        return undefined;
      }
    } catch (error) {
      this.logging.logger.warn({ err: error, key }, "Redis cache read failed");
      return undefined;
    }
  }

  private async writeJson<Value>(key: string, value: Value, ttlSeconds: number) {
    try {
      const redis = await this.redis.getClient();
      await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch (error) {
      this.logging.logger.warn({ err: error, key }, "Redis cache write failed");
    }
  }

  async rememberJson<Value>(
    key: string,
    options: RememberJsonOptions,
    loader: () => Promise<Value>,
  ): Promise<Value> {
    const cachedValue = await this.readJson<Value>(key);

    if (cachedValue !== undefined) {
      return cachedValue;
    }

    if (!options.useLock) {
      const value = await loader();
      await this.writeJson(key, value, options.ttlSeconds);
      return value;
    }

    const lockKey = `${key}:lock`;
    const lockTtlSeconds = options.lockTtlSeconds ?? 5;
    const lockWaitMilliseconds = options.lockWaitMilliseconds ?? 75;
    let lockAcquired: boolean;

    try {
      const redis = await this.redis.getClient();
      lockAcquired = Boolean(
        await redis.set(lockKey, "1", { NX: true, EX: lockTtlSeconds }),
      );

      if (!lockAcquired) {
        await wait(lockWaitMilliseconds);
        const cachedValueCreatedByAnotherRequest = await this.readJson<Value>(key);

        if (cachedValueCreatedByAnotherRequest !== undefined) {
          return cachedValueCreatedByAnotherRequest;
        }
      }
    } catch (error) {
      this.logging.logger.warn({ err: error, key }, "Redis cache lock failed");
      return loader();
    }

    try {
      const value = await loader();
      await this.writeJson(key, value, options.ttlSeconds);
      return value;
    } finally {
      if (lockAcquired) {
        try {
          const redis = await this.redis.getClient();
          await redis.del(lockKey);
        } catch (error) {
          this.logging.logger.warn({ err: error, lockKey }, "Redis cache lock release failed");
        }
      }
    }
  }

  async deleteCacheKeys(keys: string[]) {
    if (keys.length === 0) {
      return;
    }

    try {
      const redis = await this.redis.getClient();
      await redis.del(keys);
    } catch (error) {
      this.logging.logger.warn({ err: error, keys }, "Redis cache invalidation failed");
    }
  }
}
