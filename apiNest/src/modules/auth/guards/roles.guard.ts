import { Inject, Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "@prisma/client";
import { AUTH_ROLES } from "@/modules/auth/decorators/roles.decorator.js";
import type { AuthenticatedRequest } from "@/modules/auth/types/authRequest.type.js";
import { AppError } from "@/common/errors/appError.js";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest<AuthenticatedRequest>().adminUser;
    if (!user) throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    const roles = this.reflector.getAllAndOverride<UserRole[]>(AUTH_ROLES, [context.getHandler(), context.getClass()]) ?? [];
    if (roles.length > 0 && !roles.includes(user.role)) {
      throw new AppError("Bạn không có quyền thực hiện hành động này.", 403, "FORBIDDEN");
    }
    return true;
  }
}
