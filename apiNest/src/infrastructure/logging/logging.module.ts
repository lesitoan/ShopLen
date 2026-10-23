import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";

@Module({ imports: [EnvModule], providers: [LoggingService], exports: [LoggingService] })
export class LoggingModule {}
