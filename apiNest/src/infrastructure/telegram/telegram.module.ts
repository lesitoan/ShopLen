import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { TelegramService } from "@/infrastructure/telegram/telegram.service.js";

@Module({ imports: [EnvModule, LoggingModule], providers: [TelegramService], exports: [TelegramService] })
export class TelegramModule {}
