import { Inject, Module, RequestMethod, type MiddlewareConsumer, type NestModule } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { AuthCoreModule } from "@/modules/auth/authCore.module.js";
import { AuthDependenciesModule } from "@/modules/auth/authDependencies.module.js";
import { ClientAuthService } from "@/modules/auth/services/clientAuth.service.js";
import { AdminAuthService } from "@/modules/auth/services/adminAuth.service.js";
import { ClientAuthController } from "@/modules/auth/controllers/clientAuth.controller.js";
import { AdminAuthController } from "@/modules/auth/controllers/adminAuth.controller.js";
import { CustomerAuthGuard } from "@/modules/auth/guards/customerAuth.guard.js";
import { AdminAuthGuard } from "@/modules/auth/guards/adminAuth.guard.js";
import { RolesGuard } from "@/modules/auth/guards/roles.guard.js";
import { AuthRateLimitService } from "@/modules/auth/http/authRateLimit.service.js";

@Module({
  imports: [EnvModule, LoggingModule, PrismaModule, AuthCoreModule, AuthDependenciesModule],
  controllers: [ClientAuthController, AdminAuthController],
  providers: [ClientAuthService, AdminAuthService, CustomerAuthGuard, AdminAuthGuard, RolesGuard, AuthRateLimitService],
  exports: [CustomerAuthGuard, AdminAuthGuard, RolesGuard, AuthCoreModule],
})
export class AuthModule implements NestModule {
  constructor(@Inject(AuthRateLimitService) private readonly limits: AuthRateLimitService) {}

  configure(consumer: MiddlewareConsumer) {
    const routes = (paths: string[]) => paths.map((path) => ({ path, method: RequestMethod.POST }));
    consumer.apply(this.limits.login).forRoutes(...routes(["auth/register", "auth/login", "auth/google", "admin/auth/login"]));
    consumer.apply(this.limits.refresh).forRoutes(...routes(["auth/refresh", "admin/auth/refresh"]));
    consumer.apply(this.limits.recovery).forRoutes(...routes(["auth/password/forgot", "auth/password/otp/verify", "auth/password/reset"]));
  }
}
