import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { RedisCacheService } from "@/infrastructure/cache/redisCache.service.js";
import type { RedisService } from "@/infrastructure/redis/redis.service.js";
import type { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { MemoryRedis } from "../harness/memoryRedis.js";

const logging = { logger: { warn: () => {} } } as unknown as LoggingService;

test("JSON cache preserves TTL, shared lock, corrupt-value recovery and invalidation", async () => {
  const redis = new MemoryRedis();
  const cache = new RedisCacheService({ getClient: async () => redis } as unknown as RedisService, logging);
  let loads = 0;
  const loader = async () => { loads++; await new Promise((resolve) => setTimeout(resolve, 5)); return { items: [1] }; };
  const options = { ttlSeconds: 600, useLock: true, lockWaitMilliseconds: 20 };
  const results = await Promise.all([cache.rememberJson("home:products:HOT_PRODUCT", options, loader), cache.rememberJson("home:products:HOT_PRODUCT", options, loader)]);
  assert.deepEqual(results, [{ items: [1] }, { items: [1] }]);
  assert.equal(loads, 1);
  assert.equal(await redis.ttl("home:products:HOT_PRODUCT"), 600);
  assert.equal(await redis.get("home:products:HOT_PRODUCT:lock"), null);
  await redis.set("client:categories", "invalid JSON", { EX: 60 });
  assert.deepEqual(await cache.rememberJson("client:categories", { ttlSeconds: 86400, useLock: true }, async () => []), []);
  assert.equal(await redis.ttl("client:categories"), 86400);
  await cache.deleteCacheKeys(["client:categories", "home:products:HOT_PRODUCT"]);
  assert.equal(await redis.get("client:categories"), null);
  await assert.rejects(cache.rememberJson("failed", options, async () => { throw new Error("loader failed"); }), /loader failed/);
  assert.equal(await redis.get("failed:lock"), null);
});

test("Redis failures fall back to the loader while loader errors still propagate", async () => {
  const cache = new RedisCacheService({ getClient: async () => { throw new Error("redis unavailable"); } } as unknown as RedisService, logging);
  assert.deepEqual(await cache.rememberJson("key", { ttlSeconds: 600, useLock: true }, async () => [1]), [1]);
  await cache.deleteCacheKeys(["key"]);
  await assert.rejects(cache.rememberJson("key", { ttlSeconds: 600, useLock: true }, async () => { throw new Error("database failed"); }), /database failed/);
});
