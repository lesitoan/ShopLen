import { LifecycleModule } from "@/infrastructure/lifecycle/lifecycle.module.js";
import { Module } from "@nestjs/common";
import { AppModule } from "@/app.module.js";
import { EnvModule } from "@/config/env.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { NotificationModule } from "@/infrastructure/queues/notification.module.js";
import { RealtimeModule } from "@/infrastructure/realtime/realtime.module.js";
import { TelegramModule } from "@/infrastructure/telegram/telegram.module.js";
import { ProductModule } from "@/modules/products/product.module.js";
import { OrderExpiryService } from "@/modules/orders/services/orderExpiry.service.js";
import { NotificationProcessor } from "@/infrastructure/queues/notification.processor.js";
import { WorkerFactoryService } from "@/runtime/workerFactory.service.js";
import { WorkersService } from "@/runtime/workers.service.js";

@Module({
  imports: [
    LifecycleModule,
    AppModule,
    EnvModule,
    LoggingModule,
    PrismaModule,
    NotificationModule,
    RealtimeModule,
    TelegramModule,
    ProductModule,
  ],
  providers: [
    OrderExpiryService,
    NotificationProcessor,
    WorkerFactoryService,
    WorkersService,
  ],
})
export class RuntimeModule {}
