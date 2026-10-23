import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { RedisModule } from "@/infrastructure/redis/redis.module.js";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { RefreshSessionService } from "@/modules/auth/services/refreshSession.service.js";
import { PasswordResetOtpService } from "@/modules/auth/services/passwordResetOtp.service.js";

@Module({
  imports: [EnvModule, RedisModule],
  providers: [TokenService, RefreshSessionService, PasswordResetOtpService],
  exports: [TokenService, RefreshSessionService, PasswordResetOtpService],
})
export class AuthCoreModule {}
