import { Inject, Injectable, type OnModuleDestroy } from "@nestjs/common";
import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { EnvService } from "@/config/env.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import type { NotificationJobData, NotificationJobName } from "@/infrastructure/queues/types/notification.type.js";

@Injectable()
export class NotificationService implements OnModuleDestroy {
  private queue: Queue<NotificationJobData> | undefined;
  private connection: Redis | undefined;

  constructor(
    @Inject(EnvService) private readonly config: EnvService,
    @Inject(LoggingService) private readonly logging: LoggingService,
  ) {}

  private getQueue() {
    if (!this.queue) {
      this.connection = new Redis(this.config.values.REDIS_URL, { maxRetriesPerRequest: null });
      this.connection.on("error", (error) => this.logging.logger.error({ err: error }, "Notification queue Redis error"));
      this.queue = new Queue<NotificationJobData>("notificationQueue", {
        connection: this.connection,
        defaultJobOptions: {
          attempts: 3, backoff: { type: "exponential", delay: 10_000 },
          removeOnComplete: { age: 86400, count: 500 },
          removeOnFail: { age: 86400 * 7, count: 1000 },
        },
      });
      this.queue.on("error", (error) => this.logging.logger.error({ err: error }, "Notification queue error"));
    }
    return this.queue;
  }

  async enqueue(jobName: NotificationJobName, data: NotificationJobData, logContext: Record<string, unknown>) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        this.getQueue().add(jobName, data),
        new Promise<never>((_resolve, reject) => {
          timer = setTimeout(() => reject(new Error("Notification queue enqueue timeout")), 1000);
        }),
      ]);
    } catch (error) {
      this.logging.logger.error({ err: error, ...logContext }, "Failed to enqueue notification");
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async onModuleDestroy() {
    try { await this.queue?.close(); }
    finally { this.connection?.disconnect(); }
  }
}
