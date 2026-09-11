import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "@/config/envValidation.js";
import { AppError } from "@/utils/appError.js";
import type {
  CustomerAccessTokenPayload,
  CustomerRefreshTokenPayload,
} from "@/types/clientAuth.type.js";
import type {
  AdminAccessTokenPayload,
  AdminRefreshTokenPayload,
} from "@/types/adminAuth.type.js";

function getAccessSecret(): Secret {
  const secret = env.JWT_ACCESS_SECRET ?? env.JWT_SECRET;

  if (!secret) {
    throw new AppError(
      "Thiếu cấu hình JWT access secret.",
      500,
      "INTERNAL_SERVER_ERROR",
      "JWT_ACCESS_SECRET or JWT_SECRET is missing",
    );
  }

  return secret;
}

function getRefreshSecret(): Secret {
  const secret = env.JWT_REFRESH_SECRET ?? env.JWT_SECRET;

  if (!secret) {
    throw new AppError(
      "Thiếu cấu hình JWT refresh secret.",
      500,
      "INTERNAL_SERVER_ERROR",
      "JWT_REFRESH_SECRET or JWT_SECRET is missing",
    );
  }

  return secret;
}

export function signCustomerAccessToken(payload: CustomerAccessTokenPayload) {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);
}

export function signCustomerRefreshToken(
  payload: Omit<CustomerRefreshTokenPayload, "exp">,
) {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
}

export function signAdminAccessToken(payload: AdminAccessTokenPayload) {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);
}

export function signAdminRefreshToken(
  payload: Omit<AdminRefreshTokenPayload, "exp">,
) {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
}

export function verifyCustomerAccessToken(token: string) {
  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(token, getAccessSecret());
  } catch (error) {
    throw new AppError(
      "Token không hợp lệ hoặc đã hết hạn.",
      401,
      "UNAUTHORIZED",
      error instanceof Error ? error.message : "Access token verify failed",
    );
  }

  if (
    typeof payload !== "object" ||
    payload.tokenType !== "CUSTOMER" ||
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string"
  ) {
    throw new AppError("Token không hợp lệ.", 401, "UNAUTHORIZED");
  }

  return payload as CustomerAccessTokenPayload;
}

export function verifyCustomerRefreshToken(token: string) {
  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(token, getRefreshSecret());
  } catch (error) {
    throw new AppError(
      "Refresh token không hợp lệ hoặc đã hết hạn.",
      401,
      "REFRESH_TOKEN_INVALID",
      error instanceof Error ? error.message : "Refresh token verify failed",
    );
  }

  if (
    typeof payload !== "object" ||
    payload.tokenType !== "CUSTOMER_REFRESH" ||
    typeof payload.sub !== "string" ||
    typeof payload.jti !== "string" ||
    typeof payload.exp !== "number"
  ) {
    throw new AppError("Refresh token không hợp lệ.", 401, "REFRESH_TOKEN_INVALID");
  }

  return payload as CustomerRefreshTokenPayload;
}

export function verifyAdminAccessToken(token: string) {
  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(token, getAccessSecret());
  } catch (error) {
    throw new AppError(
      "Token không hợp lệ hoặc đã hết hạn.",
      401,
      "UNAUTHORIZED",
      error instanceof Error ? error.message : "Admin access token verify failed",
    );
  }

  if (
    typeof payload !== "object" ||
    payload.tokenType !== "ADMIN" ||
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.role !== "string"
  ) {
    throw new AppError("Token không hợp lệ.", 401, "UNAUTHORIZED");
  }

  return payload as AdminAccessTokenPayload;
}

export function verifyAdminRefreshToken(token: string) {
  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(token, getRefreshSecret());
  } catch (error) {
    throw new AppError(
      "Refresh token không hợp lệ hoặc đã hết hạn.",
      401,
      "REFRESH_TOKEN_INVALID",
      error instanceof Error ? error.message : "Admin refresh token verify failed",
    );
  }

  if (
    typeof payload !== "object" ||
    payload.tokenType !== "ADMIN_REFRESH" ||
    typeof payload.sub !== "string" ||
    typeof payload.jti !== "string" ||
    typeof payload.exp !== "number"
  ) {
    throw new AppError("Refresh token không hợp lệ.", 401, "REFRESH_TOKEN_INVALID");
  }

  return payload as AdminRefreshTokenPayload;
}
