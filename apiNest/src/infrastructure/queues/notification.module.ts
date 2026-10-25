import { LifecycleModule } from "@/infrastructure/lifecycle/lifecycle.module.js";
import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { NotificationService } from "@/infrastructure/queues/notification.service.js";

@Module({ imports: [LifecycleModule, EnvModule, LoggingModule], providers: [NotificationService], exports: [NotificationService] })
export class NotificationModule {}
