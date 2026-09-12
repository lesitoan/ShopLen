import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { env } from "@/config/envValidation.js";
import { logger } from "@/config/logger.js";
import {
  ORDER_EXPIRY_JOB_NAME,
  ORDER_EXPIRY_QUEUE_NAME,
  scheduleOrderExpiryJob,
} from "@/queues/orderExpiryQueue.js";
import { orderExpiryService } from "@/services/orderExpiryService.js";

const globalForOrderExpiryWorker = globalThis as unknown as {
  orderExpiryWorkerConnection?: Redis;
  orderExpiryWorker?: Worker;
};

export function startOrderExpiryWorker() {
  if (globalForOrderExpiryWorker.orderExpiryWorker) {
    return globalForOrderExpiryWorker.orderExpiryWorker;
  }

  const connection =
    globalForOrderExpiryWorker.orderExpiryWorkerConnection ??
    new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });

  connection.on("error", (error) => {
    logger.error({ err: error }, "Order expiry worker Redis error");
  });

  const worker = new Worker(
    ORDER_EXPIRY_QUEUE_NAME,
    async (job) => {
      if (job.name !== ORDER_EXPIRY_JOB_NAME) {
        logger.warn({ jobName: job.name }, "Unknown order expiry job skipped");
        return;
      }

      const expiredOrderCount = await orderExpiryService.expirePendingOrders();

      if (expiredOrderCount > 0) {
        logger.info({ expiredOrderCount }, "Expired pending payment orders");
      }
    },
    {
      connection,
      concurrency: 1,
    },
  );

  worker.on("failed", (job, error) => {
    logger.error(
      {
        err: error,
        jobId: job?.id,
        jobName: job?.name,
      },
      "Order expiry job failed",
    );
  });

  void scheduleOrderExpiryJob().catch((error) => {
    logger.error({ err: error }, "Failed to schedule order expiry job");
  });

  logger.info("Order expiry worker started");

  if (process.env.NODE_ENV !== "production") {
    globalForOrderExpiryWorker.orderExpiryWorkerConnection = connection;
    globalForOrderExpiryWorker.orderExpiryWorker = worker;
  }

  return worker;
}
