import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { EmailService } from "@/infrastructure/email/email.service.js";

@Module({
  imports: [EnvModule, LoggingModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
