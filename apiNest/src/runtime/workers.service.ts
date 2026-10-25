import { ResourceDrainService } from "@/infrastructure/lifecycle/resourceDrain.service.js";
import { Inject, Injectable, type OnApplicationBootstrap, type OnModuleDestroy } from "@nestjs/common";
import type { Worker, Queue } from "bullmq";
import type { Redis } from "ioredis";
import { WorkerFactoryService } from "@/runtime/workerFactory.service.js";
import { NotificationProcessor } from "@/infrastructure/queues/notification.processor.js";
import { OrderExpiryService } from "@/modules/orders/services/orderExpiry.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { ORDER_EXPIRY_JOB_NAME, ORDER_EXPIRY_QUEUE_NAME } from "@/infrastructure/queues/queueOptions.js";

@Injectable()
export class WorkersService implements OnApplicationBootstrap, OnModuleDestroy {
  private workers: Worker[] = [];
  private connections: Redis[] = [];
  private queue: Queue | undefined;
  private stopping: Promise<void> | undefined;

  constructor(
    @Inject(WorkerFactoryService) private readonly factory: WorkerFactoryService,
    @Inject(NotificationProcessor) private readonly notifications: NotificationProcessor,
    @Inject(OrderExpiryService) private readonly expiry: OrderExpiryService,
    @Inject(LoggingService) private readonly logging: LoggingService,
    @Inject(ResourceDrainService) private readonly drain: ResourceDrainService,
  ) { this.drain.register(() => this.stop()); }

  onApplicationBootstrap() { this.start(); }

  start() {
    if (this.workers.length || this.stopping) return;
    try {
      const notificationConnection = this.factory.connection("Notification worker");
      this.connections.push(notificationConnection);
      this.workers.push(this.factory.worker("notificationQueue", (job) => this.notifications.process(job), notificationConnection, 3));
      const expiryConnection = this.factory.connection("Order expiry worker");
      this.connections.push(expiryConnection);
      this.workers.push(this.factory.worker(ORDER_EXPIRY_QUEUE_NAME, async (job) => {
        if (job.name !== ORDER_EXPIRY_JOB_NAME) {
          this.logging.logger.warn({ jobName: job.name }, "Unknown order expiry job skipped"); return;
        }
        const expiredOrderCount = await this.expiry.expirePendingOrders();
        if (expiredOrderCount > 0) this.logging.logger.info({ expiredOrderCount }, "Expired pending payment orders");
      }, expiryConnection, 1));
      const queueConnection = this.factory.connection("Order expiry queue");
      this.connections.push(queueConnection);
      this.queue = this.factory.queue(ORDER_EXPIRY_QUEUE_NAME, queueConnection);
      void this.queue.upsertJobScheduler("orderExpiryScheduler", { every: 60000 }, { name: ORDER_EXPIRY_JOB_NAME, data: {} })
        .catch((error) => this.logging.logger.error({ err: error }, "Failed to schedule order expiry job"));
    } catch (error) {
      void this.onModuleDestroy().catch((cleanupError) => this.logging.logger.error({ err: cleanupError }, "Failed to clean up workers after startup failure"));
      throw error;
    }
  }

  onModuleDestroy() { return this.drain.drain(); }

  stop() { return this.stopping ??= this.closeResources(); }

  private async closeResources() {
    const workers = this.workers;
    this.workers = [];
    let errors: unknown[];
    try {
      const results = await Promise.allSettled(workers.map((worker) => worker.close()));
      errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
    }
    finally {
      try { await this.queue?.close(); }
      finally {
        this.queue = undefined;
        for (const connection of this.connections) connection.disconnect();
        this.connections = [];
      }
    }
    if (errors.length) throw new AggregateError(errors, "Failed to close workers");
  }
}
