import {
  Inject,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { toAdminSession } from "@/modules/auth/mappers/adminAuthMapper.js";
import { AppError } from "@/common/errors/appError.js";
import type { AuthenticatedRequest } from "@/modules/auth/types/authRequest.type.js";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(TokenService) private readonly tokens: TokenService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;
    const token = header?.startsWith("Bearer ")
      ? header.slice("Bearer ".length)
      : null;
    if (!token)
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    const payload = this.tokens.verifyAdminAccessToken(token);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user)
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    if (user.status !== "ACTIVE")
      throw new AppError("Tài khoản quản trị đã bị khóa.", 403, "USER_LOCKED");
    request.adminUserId = user.id;
    request.adminUser = toAdminSession(user);
    return true;
  }
}
