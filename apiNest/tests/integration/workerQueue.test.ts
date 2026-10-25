import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { Queue, QueueEvents, Worker } from "bullmq";
import { Redis } from "ioredis";
import { TelegramService } from "@/infrastructure/telegram/telegram.service.js";
import { NotificationProcessor } from "@/infrastructure/queues/notification.processor.js";
import { EnvService } from "@/config/env.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { queueJobOptions, ORDER_EXPIRY_JOB_NAME } from "@/infrastructure/queues/queueOptions.js";

if (process.env.SHOPLEN_INTEGRATION_TESTS !== "1") throw new Error("Run through the verified test target runner.");

test("real BullMQ retries legacy jobs and retains scheduler identity on isolated Redis keys", { timeout: 60000 }, async () => {
  const prefix = `integration-${randomUUID()}`;
  const config = new EnvService(), logging = new LoggingService(config);
  const connection = new Redis(config.values.REDIS_URL, { maxRetriesPerRequest: null });
  connection.on("error", () => {});
  const queue = new Queue("notificationQueue", { connection, prefix, defaultJobOptions: queueJobOptions });
  const expiry = new Queue("orderExpiryQueue", { connection, prefix, defaultJobOptions: queueJobOptions });
  const events = new QueueEvents("notificationQueue", { connection, prefix });
  events.on("error", () => {});
  let attempts = 0;
  const telegram = new TelegramService(config, logging);
  telegram.notifyOrderPaid = async () => { attempts++; if (attempts === 1) throw new Error("retry probe"); return { sent: true }; };
  const processor = new NotificationProcessor(telegram, logging);
  const worker = new Worker("notificationQueue", (job) => processor.process(job), { connection, prefix, concurrency: 3 });
  worker.on("error", () => {});
  try {
    await events.waitUntilReady();
    const job = await queue.add("ORDER_PAID", { orderId: "legacy-order", orderCode: "DHLEGACY", totalAmount: 100000, paidAt: new Date().toISOString() });
    await job.waitUntilFinished(events, 35000);
    assert.equal(attempts, 2);
    assert.equal((await queue.getJob(job.id!))!.attemptsMade, 2);
    await expiry.upsertJobScheduler("orderExpiryScheduler", { every: 60000 }, { name: ORDER_EXPIRY_JOB_NAME, data: {} });
    await expiry.upsertJobScheduler("orderExpiryScheduler", { every: 60000 }, { name: ORDER_EXPIRY_JOB_NAME, data: {} });
    const schedulers = await expiry.getJobSchedulers();
    assert.equal(schedulers.length, 1);
    assert.equal(schedulers[0]!.name, ORDER_EXPIRY_JOB_NAME);
    assert.equal(schedulers[0]!.every, 60000);
  } finally {
    await worker.close(); await events.close();
    await expiry.removeJobScheduler("orderExpiryScheduler");
    await queue.obliterate({ force: true }); await expiry.obliterate({ force: true });
    await queue.close(); await expiry.close(); connection.disconnect();
  }
});
