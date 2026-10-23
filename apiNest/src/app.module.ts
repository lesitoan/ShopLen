import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { HealthModule } from "@/modules/health/health.module.js";

@Module({ imports: [EnvModule, HealthModule] })
export class AppModule {}
