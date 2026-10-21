import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { GoogleAuthService } from "@/infrastructure/google/googleAuth.service.js";
import { EmailModule } from "@/infrastructure/email/email.module.js";
import { NotificationModule } from "@/infrastructure/queues/notification.module.js";

@Module({
  imports: [EnvModule, LoggingModule, NotificationModule, EmailModule],
  providers: [GoogleAuthService],
  exports: [GoogleAuthService, EmailModule, NotificationModule],
})
export class AuthDependenciesModule {}
