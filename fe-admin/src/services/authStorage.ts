import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
} from "@/constants/auth";
import type { AdminAuthTokens } from "@/types/auth.type";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookieUtils";

export function saveAuthTokens(tokens: AdminAuthTokens) {
  setCookie(ADMIN_ACCESS_TOKEN_COOKIE, tokens.accessToken, 7);
  setCookie(ADMIN_REFRESH_TOKEN_COOKIE, tokens.refreshToken, 30);
}

export function clearAuthTokens() {
  deleteCookie(ADMIN_ACCESS_TOKEN_COOKIE);
  deleteCookie(ADMIN_REFRESH_TOKEN_COOKIE);
}

export function getAccessToken() {
  return getCookie(ADMIN_ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken() {
  return getCookie(ADMIN_REFRESH_TOKEN_COOKIE);
}

export function hasAuthTokens() {
  return Boolean(getAccessToken() && getRefreshToken());
}
