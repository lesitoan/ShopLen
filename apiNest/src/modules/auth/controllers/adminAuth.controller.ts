import { Controller, Get, HttpCode, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { AdminAuthService } from "@/modules/auth/services/adminAuth.service.js";
import { AdminAuthGuard } from "@/modules/auth/guards/adminAuth.guard.js";
import { CurrentAdmin } from "@/modules/auth/decorators/authActor.decorator.js";
import type { AdminSession } from "@/modules/auth/types/adminAuth.type.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { successResponse } from "@/common/responses/httpResponse.js";
import { AppError } from "@/common/errors/appError.js";
import { clearRefreshTokenCookie, getRefreshTokenCookie, setRefreshTokenCookie } from "@/modules/auth/http/authCookie.js";
import { adminLoginDto, adminLogoutDto, adminRefreshTokenDto, type AdminLoginRequestDto } from "@/modules/auth/dto/adminAuth.dto.js";

@Controller("admin/auth")
export class AdminAuthController {
  constructor(@Inject(AdminAuthService) private readonly service: AdminAuthService) {}

  @Post("login")
  @HttpCode(200)
  async login(@ValidatedRequest(adminLoginDto) input: { body: AdminLoginRequestDto }, @Res({ passthrough: true }) response: Response) {
    const result = await this.service.login(input.body);
    setRefreshTokenCookie(response, "ADMIN", result.refreshToken);
    return successResponse({ accessToken: result.accessToken }, "Đăng nhập thành công.");
  }

  @Get("me")
  @UseGuards(AdminAuthGuard)
  async me(@CurrentAdmin() admin: AdminSession) { return successResponse(await this.service.getMe(admin.id)); }

  @Post("refresh")
  @HttpCode(200)
  async refresh(@ValidatedRequest(adminRefreshTokenDto) _input: unknown, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = getRefreshTokenCookie(request, "ADMIN");
    if (!refreshToken) throw new AppError("Refresh token không hợp lệ hoặc đã hết hạn.", 401, "REFRESH_TOKEN_INVALID");
    const result = await this.service.refresh({ refreshToken });
    setRefreshTokenCookie(response, "ADMIN", result.refreshToken);
    return successResponse({ accessToken: result.accessToken });
  }

  @Post("logout")
  @HttpCode(200)
  async logout(@ValidatedRequest(adminLogoutDto) _input: unknown, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.service.logout({ refreshToken: getRefreshTokenCookie(request, "ADMIN") });
    clearRefreshTokenCookie(response, "ADMIN");
    return successResponse(result, "Đăng xuất thành công.");
  }
}
