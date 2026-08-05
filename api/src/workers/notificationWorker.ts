import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { env } from "@/config/envValidation.js";
import { logger } from "@/config/logger.js";
import { telegramService } from "@/services/telegramService.js";
import {
  NOTIFICATION_JOB_NAMES,
  type CustomerRegisteredNotificationJobData,
  type NotificationJobData,
  type OrderCancelledNotificationJobData,
  type OrderPaidNotificationJobData,
  type OrderShippingAddressUpdatedNotificationJobData,
} from "@/types/notification.type.js";

const globalForNotificationWorker = globalThis as unknown as {
  notificationWorkerConnection?: Redis;
  notificationWorker?: Worker<NotificationJobData>;
};

export function startNotificationWorker() {
  if (globalForNotificationWorker.notificationWorker) {
    return globalForNotificationWorker.notificationWorker;
  }

  const connection =
    globalForNotificationWorker.notificationWorkerConnection ??
    new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });

  connection.on("error", (error) => {
    logger.error({ err: error }, "Notification worker Redis error");
  });

  const worker = new Worker<NotificationJobData>(
    "notificationQueue",
    async (job) => {
      if (job.name === NOTIFICATION_JOB_NAMES.CUSTOMER_REGISTERED) {
        await telegramService.notifyCustomerRegistered(
          job.data as CustomerRegisteredNotificationJobData,
        );
        return;
      }

      if (job.name === NOTIFICATION_JOB_NAMES.ORDER_PAID) {
        await telegramService.notifyOrderPaid(
          job.data as OrderPaidNotificationJobData,
        );
        return;
      }

      if (job.name === NOTIFICATION_JOB_NAMES.ORDER_CANCELLED) {
        await telegramService.notifyOrderCancelled(
          job.data as OrderCancelledNotificationJobData,
        );
        return;
      }

      if (job.name === NOTIFICATION_JOB_NAMES.ORDER_SHIPPING_ADDRESS_UPDATED) {
        await telegramService.notifyOrderShippingAddressUpdated(
          job.data as OrderShippingAddressUpdatedNotificationJobData,
        );
        return;
      }

      logger.warn({ jobName: job.name }, "Unknown notification job skipped");
    },
    {
      connection,
      concurrency: 3,
    },
  );

  worker.on("completed", (job) => {
    logger.info(
      { jobId: job.id, jobName: job.name },
      "Notification job completed",
    );
  });

  worker.on("failed", (job, error) => {
    logger.error(
      {
        err: error,
        jobId: job?.id,
        jobName: job?.name,
      },
      "Notification job failed",
    );
  });

  logger.info("Notification worker started");

  if (process.env.NODE_ENV !== "production") {
    globalForNotificationWorker.notificationWorkerConnection = connection;
    globalForNotificationWorker.notificationWorker = worker;
  }

  return worker;
}
