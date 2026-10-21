import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { EmailModule } from "@/infrastructure/email/email.module.js";
import { NotificationModule } from "@/infrastructure/queues/notification.module.js";
import { ClientPaymentController } from "@/modules/payments/controllers/clientPayment.controller.js";
import { ClientPaymentService } from "@/modules/payments/services/clientPayment.service.js";

@Module({ imports: [EnvModule, LoggingModule, PrismaModule, EmailModule, NotificationModule], controllers: [ClientPaymentController], providers: [ClientPaymentService] })
export class PaymentModule {}
