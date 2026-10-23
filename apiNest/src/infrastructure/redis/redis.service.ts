import { Inject, Injectable, Logger, type OnModuleDestroy } from "@nestjs/common";
import type { createClient } from "redis";
import { AppError } from "@/common/errors/appError.js";
import { REDIS_CLIENT } from "@/infrastructure/redis/redisTokens.js";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private connecting: Promise<ReturnType<typeof createClient>> | undefined;
  private closing = false;

  constructor(@Inject(REDIS_CLIENT) private readonly client: ReturnType<typeof createClient>) {
    this.client.on("error", () => this.logger.error("Redis connection error"));
  }

  async getClient() {
    if (this.closing) throw new AppError("Không thể kết nối Redis.", 500, "REDIS_CONNECTION_FAILED");
    if (this.client.isReady) return this.client;
    if (!this.connecting) {
      this.connecting = this.client.connect().then(() => this.client).catch((error: unknown) => {
        throw new AppError(
          "Không thể kết nối Redis.", 500, "REDIS_CONNECTION_FAILED",
          error instanceof Error ? error.message : "Unknown Redis connection error.",
        );
      }).finally(() => {
        this.connecting = undefined;
      });
    }
    return this.connecting;
  }

  async onModuleDestroy() {
    this.closing = true;
    if (this.client.isReady) await this.client.close();
    else if (this.client.isOpen) this.client.destroy();
  }
}
