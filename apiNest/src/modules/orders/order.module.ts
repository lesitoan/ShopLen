import { Inject, Module, RequestMethod, type MiddlewareConsumer, type NestModule } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { NotificationModule } from "@/infrastructure/queues/notification.module.js";
import { RealtimeModule } from "@/infrastructure/realtime/realtime.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { ClientOrderController } from "@/modules/orders/controllers/clientOrder.controller.js";
import { ClientOrderService } from "@/modules/orders/services/clientOrder.service.js";
import { OrderLookupRateLimitService } from "@/modules/orders/http/orderLookupRateLimit.service.js";

@Module({ imports: [EnvModule, PrismaModule, NotificationModule, RealtimeModule, AuthModule], controllers: [ClientOrderController], providers: [ClientOrderService, OrderLookupRateLimitService] })
export class OrderModule implements NestModule {
  constructor(@Inject(OrderLookupRateLimitService) private readonly limits: OrderLookupRateLimitService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.limits.lookup).forRoutes({ path: "orders/lookup", method: RequestMethod.POST });
  }
}
