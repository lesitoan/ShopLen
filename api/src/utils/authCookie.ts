import type { Request, Response } from "express";
import { env } from "@/config/envValidation.js";

const CUSTOMER_REFRESH_TOKEN_COOKIE = "refreshToken";
const ADMIN_REFRESH_TOKEN_COOKIE = "adminRefreshToken";
const CUSTOMER_ACCESS_TOKEN_COOKIE = "accessToken";
const ADMIN_ACCESS_TOKEN_COOKIE = "adminAccessToken";
const CUSTOMER_AUTH_COOKIE_PATH = "/api/v1/auth";
const ADMIN_AUTH_COOKIE_PATH = "/api/v1/admin/auth";
const CUSTOMER_ACCESS_COOKIE_PATH = "/api/v1";
const ADMIN_ACCESS_COOKIE_PATH = "/api/v1/admin";

type AuthCookieScope = "CUSTOMER" | "ADMIN";

function getCookieOptions(path: string) {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path,
    maxAge: getRefreshTokenMaxAgeMilliseconds(),
  };
}

function getRefreshTokenMaxAgeMilliseconds() {
  const match = /^(\d+)(s|m|h|d)$/.exec(env.JWT_REFRESH_EXPIRES_IN);

  if (!match) {
    throw new Error("JWT_REFRESH_EXPIRES_IN must use s, m, h, or d units.");
  }

  const multipliers = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return Number(match[1]) * multipliers[match[2] as keyof typeof multipliers];
}

function getAccessTokenMaxAgeMilliseconds() {
  const match = /^(\d+)(s|m|h|d)$/.exec(env.JWT_ACCESS_EXPIRES_IN);

  if (!match) {
    throw new Error("JWT_ACCESS_EXPIRES_IN must use s, m, h, or d units.");
  }

  const multipliers = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return Number(match[1]) * multipliers[match[2] as keyof typeof multipliers];
}

function getCookieConfig(scope: AuthCookieScope) {
  return scope === "CUSTOMER"
    ? {
        name: CUSTOMER_REFRESH_TOKEN_COOKIE,
        path: CUSTOMER_AUTH_COOKIE_PATH,
      }
    : {
        name: ADMIN_REFRESH_TOKEN_COOKIE,
        path: ADMIN_AUTH_COOKIE_PATH,
      };
}

function getCookieValue(request: Request, name: string) {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookiePair = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  if (!cookiePair) {
    return null;
  }

  try {
    return decodeURIComponent(cookiePair.slice(name.length + 1));
  } catch {
    return null;
  }
}

export function setRefreshTokenCookie(
  response: Response,
  scope: AuthCookieScope,
  refreshToken: string,
) {
  const config = getCookieConfig(scope);
  response.cookie(config.name, refreshToken, getCookieOptions(config.path));
}

export function clearRefreshTokenCookie(response: Response, scope: AuthCookieScope) {
  const config = getCookieConfig(scope);
  response.clearCookie(config.name, getCookieOptions(config.path));
}

export function getRefreshTokenCookie(request: Request, scope: AuthCookieScope) {
  return getCookieValue(request, getCookieConfig(scope).name);
}

export function setAccessTokenCookie(
  response: Response,
  scope: AuthCookieScope,
  accessToken: string,
) {
  const config =
    scope === "CUSTOMER"
      ? { name: CUSTOMER_ACCESS_TOKEN_COOKIE, path: CUSTOMER_ACCESS_COOKIE_PATH }
      : { name: ADMIN_ACCESS_TOKEN_COOKIE, path: ADMIN_ACCESS_COOKIE_PATH };

  response.cookie(config.name, accessToken, {
    ...getCookieOptions(config.path),
    maxAge: getAccessTokenMaxAgeMilliseconds(),
  });
}

export function clearAccessTokenCookie(response: Response, scope: AuthCookieScope) {
  const config =
    scope === "CUSTOMER"
      ? { name: CUSTOMER_ACCESS_TOKEN_COOKIE, path: CUSTOMER_ACCESS_COOKIE_PATH }
      : { name: ADMIN_ACCESS_TOKEN_COOKIE, path: ADMIN_ACCESS_COOKIE_PATH };

  response.clearCookie(config.name, getCookieOptions(config.path));
}

export function getAccessTokenCookie(request: Request, scope: AuthCookieScope) {
  const name =
    scope === "CUSTOMER"
      ? CUSTOMER_ACCESS_TOKEN_COOKIE
      : ADMIN_ACCESS_TOKEN_COOKIE;
  return getCookieValue(request, name);
}
