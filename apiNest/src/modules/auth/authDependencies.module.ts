import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { GoogleAuthService } from "@/infrastructure/google/googleAuth.service.js";
import { EmailService } from "@/infrastructure/email/email.service.js";
import { NotificationModule } from "@/infrastructure/queues/notification.module.js";

@Module({
  imports: [EnvModule, LoggingModule, NotificationModule],
  providers: [GoogleAuthService, EmailService],
  exports: [GoogleAuthService, EmailService, NotificationModule],
})
export class AuthDependenciesModule {}
