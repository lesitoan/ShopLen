import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { createClient } from "redis";
import { EnvService } from "@/config/env.service.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { RedisService } from "@/infrastructure/redis/redis.service.js";
import { infrastructureFixtures } from "../fixtures/infrastructure.js";

test("legacy and Nest fixture stores remain independent and equivalent before mutations", async () => {
  const pairs = Object.values(infrastructureFixtures).map((fixture) => {
    const config = new EnvService();
    const env = { values: { ...config.values, DATABASE_URL: fixture.databaseUrl, REDIS_URL: fixture.redisUrl } } as EnvService;
    return {
      prisma: new PrismaService(env),
      redis: new RedisService(createClient({
        url: fixture.redisUrl,
        socket: { reconnectStrategy: false, connectTimeout: 3_000 },
      })),
    };
  });
  try {
    for (const pair of pairs) {
      await pair.prisma.category.upsert({
        where: { code: "CONTRACT_BASELINE" },
        create: { code: "CONTRACT_BASELINE", name: "Danh mục kiểm thử", slug: "contract-baseline" },
        update: { name: "Danh mục kiểm thử" },
      });
      const redis = await pair.redis.getClient();
      await redis.set("contract:baseline", "original", { EX: 60 });
    }
    const select = { code: true, name: true, slug: true } as const;
    assert.deepEqual(
      await pairs[0].prisma.category.findUnique({ where: { code: "CONTRACT_BASELINE" }, select }),
      await pairs[1].prisma.category.findUnique({ where: { code: "CONTRACT_BASELINE" }, select }),
    );
    await pairs[1].prisma.category.update({ where: { code: "CONTRACT_BASELINE" }, data: { name: "Nest changed" } });
    assert.equal((await pairs[0].prisma.category.findUniqueOrThrow({ where: { code: "CONTRACT_BASELINE" } })).name, "Danh mục kiểm thử");
    await (await pairs[1].redis.getClient()).set("contract:baseline", "Nest changed");
    assert.equal(await (await pairs[0].redis.getClient()).get("contract:baseline"), "original");
  } finally {
    for (const pair of pairs) {
      await pair.prisma.category.deleteMany({ where: { code: "CONTRACT_BASELINE" } }).catch(() => {});
      const redis = await pair.redis.getClient().catch(() => undefined);
      if (redis) await redis.del("contract:baseline");
      await pair.redis.onModuleDestroy();
      await pair.prisma.onModuleDestroy();
    }
  }
});
