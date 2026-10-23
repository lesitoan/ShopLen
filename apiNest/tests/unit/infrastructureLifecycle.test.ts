import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import type { createClient } from "redis";
import { AppError } from "@/common/errors/appError.js";
import { EnvService } from "@/config/env.service.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { RedisService } from "@/infrastructure/redis/redis.service.js";

test("concurrent Redis callers share one connection and shutdown drains a ready client", async () => {
  let connectCalls = 0;
  let closeCalls = 0;
  let complete: (() => void) | undefined;
  const client = {
    isOpen: false, isReady: false, on: () => {},
    connect: async () => {
      connectCalls += 1;
      client.isOpen = true;
      await new Promise<void>((resolve) => { complete = resolve; });
      client.isReady = true;
      return client;
    },
    close: async () => { closeCalls += 1; client.isOpen = false; client.isReady = false; },
    destroy: () => { throw new Error("ready clients should close gracefully"); },
  };
  const service = new RedisService(client as unknown as ReturnType<typeof createClient>);
  const pending = [service.getClient(), service.getClient(), service.getClient()];
  assert.equal(connectCalls, 1);
  complete?.();
  for (const result of await Promise.all(pending)) assert.equal(result, client);
  assert.equal(await service.getClient(), client);
  assert.equal(connectCalls, 1);
  await service.onModuleDestroy();
  await service.onModuleDestroy();
  assert.equal(closeCalls, 1);
  await assert.rejects(service.getClient(), (error: unknown) => error instanceof AppError && error.errorCode === "REDIS_CONNECTION_FAILED");
});

test("failed Redis connect is translated and a subsequent caller can retry", async () => {
  let connectCalls = 0;
  const client = {
    isOpen: false, isReady: false, on: () => {},
    connect: async () => {
      connectCalls += 1;
      if (connectCalls === 1) throw new Error("connection refused");
      client.isOpen = true;
      client.isReady = true;
      return client;
    },
    close: async () => { client.isOpen = false; client.isReady = false; },
  };
  const service = new RedisService(client as unknown as ReturnType<typeof createClient>);
  await assert.rejects(service.getClient(), (error: unknown) => error instanceof AppError
    && error.errorCode === "REDIS_CONNECTION_FAILED" && error.internalMessage === "connection refused");
  assert.equal(await service.getClient(), client);
  assert.equal(connectCalls, 2);
  await service.onModuleDestroy();
});

test("shutdown destroys a reconnecting Redis socket and disconnects Prisma", async () => {
  let destroyed = 0;
  const client = { isOpen: true, isReady: false, on: () => {}, destroy: () => { destroyed += 1; } };
  await new RedisService(client as unknown as ReturnType<typeof createClient>).onModuleDestroy();
  assert.equal(destroyed, 1);
  const prisma = new PrismaService(new EnvService());
  let disconnected = 0;
  prisma.$disconnect = async () => { disconnected += 1; };
  await prisma.onModuleDestroy();
  assert.equal(disconnected, 1);
});
