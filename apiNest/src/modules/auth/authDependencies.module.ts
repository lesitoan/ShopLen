import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { GoogleAuthService } from "@/infrastructure/google/googleAuth.service.js";
import { EmailService } from "@/infrastructure/email/email.service.js";
import { NotificationService } from "@/infrastructure/queues/notification.service.js";

@Module({
  imports: [EnvModule, LoggingModule],
  providers: [GoogleAuthService, EmailService, NotificationService],
  exports: [GoogleAuthService, EmailService, NotificationService],
})
export class AuthDependenciesModule {}
