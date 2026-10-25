import { Queue, Worker } from "bullmq";
import { setTimeout } from "node:timers/promises";
import { WorkerFactoryService } from "/app/dist/runtime/workerFactory.service.js";
import { TelegramService } from "/app/dist/infrastructure/telegram/telegram.service.js";
import { queueJobOptions } from "/app/dist/infrastructure/queues/queueOptions.js";

const prefix = process.env.SHOPLEN_QUEUE_PREFIX;
if (process.env.SHOPLEN_CONTAINER_PROBE !== "1" || !/^integration-[0-9a-f-]{36}$/.test(prefix ?? "")) throw new Error("Use only the dedicated container probe runner.");
WorkerFactoryService.prototype.worker = function (name, process, connection, concurrency) {
  const worker = new Worker(name, process, { connection, concurrency, prefix });
  worker.on("error", () => {});
  return worker;
};
WorkerFactoryService.prototype.queue = function (name, connection) {
  const queue = new Queue(name, { connection, prefix, defaultJobOptions: queueJobOptions });
  queue.on("error", () => {});
  return queue;
};
TelegramService.prototype.notifyOrderPaid = async function () {
  console.log("CONTAINER_JOB_STARTED");
  await setTimeout(5000);
  console.log("CONTAINER_JOB_COMPLETED");
  return { sent: true };
};
await import("/app/dist/mainWithWorkers.js");
console.log("CONTAINER_PROBE_READY");
