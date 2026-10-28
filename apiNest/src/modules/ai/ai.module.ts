import { Module, RequestMethod, type NestModule, type MiddlewareConsumer } from "@nestjs/common";
import { rateLimit } from "express-rate-limit";
import { EnvModule } from "@/config/env.module.js";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { InternalAiGuard } from "@/modules/ai/guards/internalAi.guard.js";
import { InternalCatalogService } from "@/modules/ai/services/internalCatalog.service.js";
import { InternalCatalogController } from "@/modules/ai/controllers/internalCatalog.controller.js";
import { ClientChatController } from "@/modules/ai/controllers/clientChat.controller.js";
import { ChatProxyService } from "@/modules/ai/services/chatProxy.service.js";

const chatLimit = rateLimit({ windowMs: 60000, limit: 15, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau.", errorCode: "RATE_LIMIT_EXCEEDED" } });

@Module({ imports: [EnvModule, PrismaModule], providers: [InternalAiGuard, InternalCatalogService, ChatProxyService], controllers: [InternalCatalogController, ClientChatController] })
export class AiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { consumer.apply(chatLimit).forRoutes({ path: "chat/messages", method: RequestMethod.POST }); }
}
