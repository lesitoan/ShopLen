import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { HealthModule } from "@/modules/health/health.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";

@Module({ imports: [EnvModule, HealthModule, LoggingModule] })
export class AppModule {}
