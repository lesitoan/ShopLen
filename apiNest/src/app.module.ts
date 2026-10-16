import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { HealthModule } from "@/modules/health/health.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";

@Module({ imports: [EnvModule, HealthModule, LoggingModule, AuthModule] })
export class AppModule {}
