import { Inject, Injectable } from "@nestjs/common";
import { Queue, Worker, type Job } from "bullmq";
import { Redis } from "ioredis";
import { EnvService } from "@/config/env.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { queueJobOptions } from "@/infrastructure/queues/queueOptions.js";

@Injectable()
export class WorkerFactoryService {
  constructor(@Inject(EnvService) private readonly config: EnvService, @Inject(LoggingService) private readonly logging: LoggingService) {}

  connection(name: string) {
    const connection = new Redis(this.config.values.REDIS_URL, { maxRetriesPerRequest: null });
    connection.on("error", (error) => this.logging.logger.error({ err: error }, `${name} Redis error`));
    return connection;
  }

  worker(name: string, process: (job: Job) => Promise<void>, connection: Redis, concurrency: number) {
    const worker = new Worker(name, process, { connection, concurrency });
    worker.on("error", (error) => this.logging.logger.error({ err: error }, `${name} worker error`));
    worker.on("failed", (job, error) => this.logging.logger.error({ err: error, jobId: job?.id, jobName: job?.name }, `${name} job failed`));
    return worker;
  }

  queue(name: string, connection: Redis) {
    const queue = new Queue(name, { connection, defaultJobOptions: queueJobOptions });
    queue.on("error", (error) => this.logging.logger.error({ err: error }, `${name} queue error`));
    return queue;
  }
}
