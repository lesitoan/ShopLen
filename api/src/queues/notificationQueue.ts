import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { env } from "@/config/envValidation.js";
import { logger } from "@/config/logger.js";
import type {
  NotificationJobData,
  NotificationJobName,
} from "@/types/notification.type.js";

const ENQUEUE_TIMEOUT_MS = 1_000;

const globalForNotificationQueue = globalThis as unknown as {
  notificationQueueConnection?: Redis;
  notificationQueue?: Queue<NotificationJobData>;
};

const notificationQueueConnection =
  globalForNotificationQueue.notificationQueueConnection ??
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });

notificationQueueConnection.on("error", (error) => {
  logger.error({ err: error }, "Notification queue Redis error");
});

export const notificationQueue =
  globalForNotificationQueue.notificationQueue ??
  new Queue<NotificationJobData>("notificationQueue", {
    connection: notificationQueueConnection,
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
  globalForNotificationQueue.notificationQueueConnection =
    notificationQueueConnection;
  globalForNotificationQueue.notificationQueue = notificationQueue;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Notification queue enqueue timeout"));
      }, timeoutMs);
    }),
  ]);
}

export async function enqueueNotification(
  jobName: NotificationJobName,
  data: NotificationJobData,
  logContext: Record<string, unknown>,
) {
  try {
    await withTimeout(notificationQueue.add(jobName, data), ENQUEUE_TIMEOUT_MS);
  } catch (error) {
    logger.error(
      {
        err: error,
        ...logContext,
      },
      "Failed to enqueue notification",
    );
  }
}
