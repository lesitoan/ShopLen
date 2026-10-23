import { Inject, Injectable, Logger, type OnModuleDestroy } from "@nestjs/common";
import { createClient } from "redis";
import { EnvService } from "@/config/env.service.js";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: ReturnType<typeof createClient>;
  private connecting: Promise<ReturnType<typeof createClient>> | undefined;

  constructor(@Inject(EnvService) config: EnvService) {
    this.client = createClient({ url: config.values.REDIS_URL });
    this.client.on("error", () => this.logger.error("Redis connection error"));
  }

  async getClient() {
    if (this.client.isReady) return this.client;
    if (!this.connecting) {
      this.connecting = this.client.connect().then(() => this.client).finally(() => {
        this.connecting = undefined;
      });
    }
    return this.connecting;
  }

  async onModuleDestroy() {
    if (this.client.isOpen) this.client.destroy();
  }
}
