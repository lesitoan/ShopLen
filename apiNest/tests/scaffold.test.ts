import "reflect-metadata";
import assert from "node:assert/strict";
import { test } from "node:test";

process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/shoplen_test";
process.env.REDIS_URL = "redis://127.0.0.1:1";
process.env.CORS_ORIGINS = "http://localhost:3000,http://localhost:3001";

test("scaffold serves legacy health without connecting to database or Redis", async () => {
  const { createApplication } = await import("@/bootstrap.js");
  const app = await createApplication();
  try {
    await app.listen(0, "127.0.0.1");
    const url = await app.getUrl();
    const response = await fetch(`${url}/health`, {
      headers: { Origin: "http://localhost:3000" },
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, service: "tiemLenApi" });
    assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:3000");
    assert.equal(response.headers.get("access-control-allow-credentials"), "true");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal((await fetch(`${url}/api/v1/health`)).status, 404);
    assert.equal((await fetch(`${url}/api/v1/__missing__`)).status, 404);
  } finally {
    await app.close();
  }
});

test("infrastructure providers resolve through DI and close without connecting", async () => {
  const { Module } = await import("@nestjs/common");
  const { NestFactory } = await import("@nestjs/core");
  const { PrismaModule } = await import("@/infrastructure/prisma/prisma.module.js");
  const { PrismaService } = await import("@/infrastructure/prisma/prisma.service.js");
  const { RedisModule } = await import("@/infrastructure/redis/redis.module.js");
  const { RedisService } = await import("@/infrastructure/redis/redis.service.js");

  class InfrastructureSmokeModule {}
  Module({ imports: [PrismaModule, RedisModule] })(InfrastructureSmokeModule);

  const context = await NestFactory.createApplicationContext(InfrastructureSmokeModule);
  try {
    const prisma = context.get(PrismaService);
    assert.equal(typeof prisma.$transaction, "function");
    assert.equal(typeof prisma.$disconnect, "function");
    assert.equal(context.get(PrismaService), prisma);
    assert.ok(context.get(RedisService) instanceof RedisService);
  } finally {
    await context.close();
  }
});
