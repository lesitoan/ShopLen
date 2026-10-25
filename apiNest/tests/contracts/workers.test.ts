import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { Test } from "@nestjs/testing";
import type { Job } from "bullmq";
import { RuntimeModule } from "@/runtime/runtime.module.js";
import { WorkerFactoryService } from "@/runtime/workerFactory.service.js";
import { WorkersService } from "@/runtime/workers.service.js";
import { NotificationProcessor } from "@/infrastructure/queues/notification.processor.js";
import { OrderExpiryService } from "@/modules/orders/services/orderExpiry.service.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { NotificationService } from "@/infrastructure/queues/notification.service.js";
import { RealtimeService } from "@/infrastructure/realtime/realtime.service.js";
import { RedisService } from "@/infrastructure/redis/redis.service.js";
import { ResourceDrainService } from "@/infrastructure/lifecycle/resourceDrain.service.js";

async function runtimeFixture(failOnWorker = false) {
  const events: string[] = [];
  const workers: Array<{ name: string; process: (job: Job) => Promise<void>; concurrency: number }> = [];
  const schedules: unknown[][] = [];
  let release!: () => void;
  const active = new Promise<void>((resolve) => { release = resolve; });
  let deliveries = 0, sweeps = 0;
  const factory = {
    connection: (name: string) => ({ disconnect: () => { events.push(`disconnect:${name}`); } }),
    worker: (name: string, process: (job: Job) => Promise<void>, _connection: unknown, concurrency: number) => {
      if (failOnWorker) throw new Error("worker construction failed");
      workers.push({ name, process, concurrency });
      return { close: async () => { events.push(`closing:${name}`); await active; events.push(`closed:${name}`); } };
    },
    queue: () => ({ upsertJobScheduler: async (...args: unknown[]) => { schedules.push(args); }, close: async () => { events.push("queue:closed"); } }),
  };
  const module = await Test.createTestingModule({ imports: [RuntimeModule] })
    .overrideProvider(WorkerFactoryService).useValue(factory)
    .overrideProvider(NotificationProcessor).useValue({ process: async () => { deliveries++; } })
    .overrideProvider(OrderExpiryService).useValue({ expirePendingOrders: async () => { sweeps++; return 1; } })
    .compile();
  const app = module.createNestApplication({ logger: false });
  const prisma = app.get(PrismaService);
  prisma.$disconnect = async () => { events.push("prisma:closed"); };
  return { app, events, workers, schedules, release, deliveries: () => deliveries, sweeps: () => sweeps };
}

test("opt-in runtime preserves worker concurrency and scheduler while draining active jobs before closing dependencies", async () => {
  const fixture = await runtimeFixture();
  const { app, workers, schedules, events, release } = fixture;
  await app.listen(0, "127.0.0.1");
  try {
    app.get(WorkersService).start();
    assert.deepEqual(workers.map(({ name, concurrency }) => ({ name, concurrency })), [{ name: "notificationQueue", concurrency: 3 }, { name: "orderExpiryQueue", concurrency: 1 }]);
    assert.deepEqual(schedules, [["orderExpiryScheduler", { every: 60000 }, { name: "EXPIRE_PENDING_ORDERS", data: {} }]]);
    await workers[0]!.process({ name: "ORDER_PAID", data: { orderId: "old-job" } } as Job);
    await workers[1]!.process({ name: "UNKNOWN", data: {} } as Job);
    assert.equal(fixture.sweeps(), 0);
    await workers[1]!.process({ name: "EXPIRE_PENDING_ORDERS", data: {} } as Job);
    assert.equal(fixture.sweeps(), 1);
    assert.equal(fixture.deliveries(), 1);
    const closing = app.close();
    await new Promise<void>((resolve) => setTimeout(resolve, 10));
    assert.equal(events.includes("prisma:closed"), false);
    assert.equal(events.includes("queue:closed"), false);
    release();
    await closing;
    assert.equal(events.filter((event) => event.startsWith("disconnect:")).length, 3);
    assert.ok(events.indexOf("prisma:closed") > events.indexOf("closed:orderExpiryQueue"));
    assert.ok(events.indexOf("queue:closed") > events.indexOf("closed:notificationQueue"));
    await app.get(WorkersService).onModuleDestroy();
    assert.equal(events.filter((event) => event === "queue:closed").length, 1);
  } finally { release(); await app.close(); }
});

test("resource shutdown waits on the same worker drain before Prisma, Redis, notification queue and sockets", async () => {
  const drain = new ResourceDrainService();
  let release!: () => void;
  let completed = false;
  drain.register(() => new Promise<void>((resolve) => { release = () => { completed = true; resolve(); }; }));
  const fixture = await runtimeFixture();
  const app = fixture.app;
  const services = [app.get(PrismaService), app.get(RedisService), app.get(NotificationService), app.get(RealtimeService)];
  for (const service of services) Reflect.set(service, "drain", drain);
  const closings = services.map((service) => service.onModuleDestroy());
  assert.equal(completed, false);
  assert.equal(fixture.events.length, 0);
  release();
  await Promise.all(closings);
  assert.equal(completed, true);
  assert.deepEqual(fixture.events, ["prisma:closed"]);
  fixture.release();
  await app.close();
});

test("partial worker startup failure releases its Redis connection", async () => {
  const fixture = await runtimeFixture(true);
  await assert.rejects(fixture.app.init(), /worker construction failed/);
  fixture.release();
  await fixture.app.get(WorkersService).onModuleDestroy();
  assert.ok(fixture.events.includes("disconnect:Notification worker"));
  await fixture.app.close();
});
