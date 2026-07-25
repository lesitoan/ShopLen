import { OAuth2Client } from "google-auth-library";
import { env } from "@/config/envValidation.js";
import { AppError } from "@/utils/appError.js";
import type { GoogleProfile } from "@/types/clientAuth.type.js";

let googleClient: OAuth2Client | null = null;

function getGoogleClient() {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new AppError(
      "Thiếu cấu hình Google Client ID.",
      500,
      "INTERNAL_SERVER_ERROR",
      "GOOGLE_CLIENT_ID is missing",
    );
  }

  googleClient ??= new OAuth2Client(env.GOOGLE_CLIENT_ID);
  return googleClient;
}

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  try {
    const ticket = await getGoogleClient().verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new AppError("Không thể xác thực Google.", 401, "GOOGLE_TOKEN_INVALID");
    }

    return {
      sub: payload.sub,
      email: payload.email.toLowerCase(),
      emailVerified: payload.email_verified === true,
      fullName: payload.name,
      avatar: payload.picture,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Không thể xác thực Google.",
      401,
      "GOOGLE_TOKEN_INVALID",
      error instanceof Error ? error.message : "Google verify failed",
    );
  }
}
