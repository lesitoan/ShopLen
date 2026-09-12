import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { env } from "@/config/envValidation.js";
import { logger } from "@/config/logger.js";

const ORDER_EXPIRY_QUEUE_NAME = "orderExpiryQueue";
export const ORDER_EXPIRY_JOB_NAME = "EXPIRE_PENDING_ORDERS";

const globalForOrderExpiryQueue = globalThis as unknown as {
  orderExpiryQueueConnection?: Redis;
  orderExpiryQueue?: Queue;
};

const orderExpiryQueueConnection =
  globalForOrderExpiryQueue.orderExpiryQueueConnection ??
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });

orderExpiryQueueConnection.on("error", (error) => {
  logger.error({ err: error }, "Order expiry queue Redis error");
});

export const orderExpiryQueue =
  globalForOrderExpiryQueue.orderExpiryQueue ??
  new Queue(ORDER_EXPIRY_QUEUE_NAME, {
    connection: orderExpiryQueueConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 10_000,
      },
      removeOnComplete: {
        age: 60 * 60 * 24,
        count: 500,
      },
      removeOnFail: {
        age: 60 * 60 * 24 * 7,
        count: 1_000,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForOrderExpiryQueue.orderExpiryQueueConnection = orderExpiryQueueConnection;
  globalForOrderExpiryQueue.orderExpiryQueue = orderExpiryQueue;
}

export async function scheduleOrderExpiryJob() {
  await orderExpiryQueue.upsertJobScheduler(
    "orderExpiryScheduler",
    { every: 60_000 },
    {
      name: ORDER_EXPIRY_JOB_NAME,
      data: {},
    },
  );
}

export { ORDER_EXPIRY_QUEUE_NAME };
