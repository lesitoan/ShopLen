import { Controller, Get, HttpCode, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { ClientAuthService } from "@/modules/auth/services/clientAuth.service.js";
import { CustomerAuthGuard } from "@/modules/auth/guards/customerAuth.guard.js";
import { CurrentCustomer } from "@/modules/auth/decorators/authActor.decorator.js";
import type { CustomerSession } from "@/modules/auth/types/clientAuth.type.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { createdResponse, successResponse } from "@/common/responses/httpResponse.js";
import { AppError } from "@/common/errors/appError.js";
import { clearRefreshTokenCookie, getRefreshTokenCookie, setRefreshTokenCookie } from "@/modules/auth/http/authCookie.js";
import {
  registerDto, loginDto, googleLoginDto, refreshTokenDto, logoutDto, forgotPasswordDto, verifyPasswordOtpDto, resetPasswordDto,
  type RegisterRequestDto, type LoginRequestDto, type GoogleLoginRequestDto, type ForgotPasswordRequestDto,
  type VerifyPasswordOtpRequestDto, type ResetPasswordRequestDto,
} from "@/modules/auth/dto/clientAuth.dto.js";

@Controller("auth")
export class ClientAuthController {
  constructor(@Inject(ClientAuthService) private readonly service: ClientAuthService) {}

  @Post("register")
  async register(@ValidatedRequest(registerDto) input: { body: RegisterRequestDto }, @Res({ passthrough: true }) response: Response) {
    const result = await this.service.register(input.body);
    setRefreshTokenCookie(response, "CUSTOMER", result.refreshToken);
    return createdResponse({ accessToken: result.accessToken }, "Đăng ký thành công.");
  }

  @Post("login")
  @HttpCode(200)
  async login(@ValidatedRequest(loginDto) input: { body: LoginRequestDto }, @Res({ passthrough: true }) response: Response) {
    const result = await this.service.login(input.body);
    setRefreshTokenCookie(response, "CUSTOMER", result.refreshToken);
    return successResponse({ accessToken: result.accessToken }, "Đăng nhập thành công.");
  }

  @Post("google")
  @HttpCode(200)
  async google(@ValidatedRequest(googleLoginDto) input: { body: GoogleLoginRequestDto }, @Res({ passthrough: true }) response: Response) {
    const result = await this.service.loginWithGoogle(input.body);
    setRefreshTokenCookie(response, "CUSTOMER", result.refreshToken);
    return successResponse({ accessToken: result.accessToken }, "Đăng nhập Google thành công.");
  }

  @Get("me")
  @UseGuards(CustomerAuthGuard)
  async me(@CurrentCustomer() customer: CustomerSession) {
    return successResponse(await this.service.getMe(customer.id));
  }

  @Post("refresh")
  @HttpCode(200)
  async refresh(@ValidatedRequest(refreshTokenDto) _input: unknown, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = getRefreshTokenCookie(request, "CUSTOMER");
    if (!refreshToken) throw new AppError("Refresh token không hợp lệ hoặc đã hết hạn.", 401, "REFRESH_TOKEN_INVALID");
    const result = await this.service.refresh({ refreshToken });
    setRefreshTokenCookie(response, "CUSTOMER", result.refreshToken);
    return successResponse({ accessToken: result.accessToken });
  }

  @Post("logout")
  @HttpCode(200)
  async logout(@ValidatedRequest(logoutDto) _input: unknown, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.service.logout({ refreshToken: getRefreshTokenCookie(request, "CUSTOMER") });
    clearRefreshTokenCookie(response, "CUSTOMER");
    return successResponse(result, "Đăng xuất thành công.");
  }

  @Post("password/forgot")
  @HttpCode(200)
  async forgot(@ValidatedRequest(forgotPasswordDto) input: { body: ForgotPasswordRequestDto }) {
    return successResponse(await this.service.forgotPassword(input.body), "Nếu email hợp lệ, mã xác nhận sẽ được gửi đến hộp thư của bạn.");
  }

  @Post("password/otp/verify")
  @HttpCode(200)
  async verifyOtp(@ValidatedRequest(verifyPasswordOtpDto) input: { body: VerifyPasswordOtpRequestDto }) {
    return successResponse(await this.service.verifyPasswordOtp(input.body), "Mã xác nhận hợp lệ.");
  }

  @Post("password/reset")
  @HttpCode(200)
  async reset(@ValidatedRequest(resetPasswordDto) input: { body: ResetPasswordRequestDto }, @Res({ passthrough: true }) response: Response) {
    const result = await this.service.resetPassword(input.body);
    clearRefreshTokenCookie(response, "CUSTOMER");
    return successResponse(result, "Đặt lại mật khẩu thành công.");
  }
}
