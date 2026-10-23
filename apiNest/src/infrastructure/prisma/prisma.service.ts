import { Inject, Injectable, type OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";
import { EnvService } from "@/config/env.service.js";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(@Inject(EnvService) config: EnvService) {
    const log: Prisma.LogLevel[] = config.values.PRISMA_LOG_QUERIES
      ? ["query", "error", "warn"]
      : ["error", "warn"];

    super({
      adapter: new PrismaPg({ connectionString: config.values.DATABASE_URL }),
      log,
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
