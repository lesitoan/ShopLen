import {
  Inject,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { toCustomerSession } from "@/modules/auth/mappers/clientAuthMapper.js";
import { AppError } from "@/common/errors/appError.js";
import type { AuthenticatedRequest } from "@/modules/auth/types/authRequest.type.js";

@Injectable()
export class CustomerAuthGuard implements CanActivate {
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
    const payload = this.tokens.verifyCustomerAccessToken(token);
    const customer = await this.prisma.customer.findUnique({
      where: { id: payload.sub },
    });
    if (!customer || customer.status !== "ACTIVE") {
      throw new AppError(
        "Tài khoản không tồn tại hoặc đã bị khóa.",
        403,
        "CUSTOMER_LOCKED",
      );
    }
    request.customerId = customer.id;
    request.customer = toCustomerSession(customer);
    return true;
  }
}
