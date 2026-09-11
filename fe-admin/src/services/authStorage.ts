import type { AdminAuthTokens } from "@/types/auth.type";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
} from "@/constants/auth";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookieUtils";

export function clearLegacyAuthCookies() {
  deleteCookie(ADMIN_REFRESH_TOKEN_COOKIE);
}

export function saveAuthTokens(tokens: AdminAuthTokens) {
  setCookie(ADMIN_ACCESS_TOKEN_COOKIE, tokens.accessToken, 15 / (24 * 60));
}

export function clearAuthTokens() {
  deleteCookie(ADMIN_ACCESS_TOKEN_COOKIE);
}

export function getAccessToken() {
  return getCookie(ADMIN_ACCESS_TOKEN_COOKIE);
}
