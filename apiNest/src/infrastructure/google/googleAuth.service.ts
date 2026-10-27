import { Inject, Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { EnvService } from "@/config/env.service.js";
import { AppError } from "@/common/errors/appError.js";
import type { GoogleProfile } from "@/modules/auth/types/clientAuth.type.js";

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client | undefined;

  constructor(@Inject(EnvService) private readonly config: EnvService) {}

  async verify(idToken: string): Promise<GoogleProfile> {
    try {
      const clientId = this.config.values.GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new AppError(
          "Thiếu cấu hình Google Client ID.",
          500,
          "INTERNAL_SERVER_ERROR",
          "GOOGLE_CLIENT_ID is missing",
        );
      }
      this.client ??= new OAuth2Client(clientId);
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email) {
        throw new AppError(
          "Không thể xác thực Google.",
          401,
          "GOOGLE_TOKEN_INVALID",
        );
      }
      return {
        sub: payload.sub,
        email: payload.email.toLowerCase(),
        emailVerified: payload.email_verified === true,
        fullName: payload.name,
        avatar: payload.picture,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Không thể xác thực Google.",
        401,
        "GOOGLE_TOKEN_INVALID",
        error instanceof Error ? error.message : "Google verify failed",
      );
    }
  }
}
