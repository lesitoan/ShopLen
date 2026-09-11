import type { AuthTokens } from "@/types/auth.type";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/constants/auth";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookieUtils";

export function clearLegacyAuthCookies() {
  deleteCookie(REFRESH_TOKEN_COOKIE);
}

export function saveAuthTokens(tokens: AuthTokens) {
  setCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, 15 / (24 * 60));
}

export function clearAuthTokens() {
  deleteCookie(ACCESS_TOKEN_COOKIE);
}

export function getAccessToken() {
  return getCookie(ACCESS_TOKEN_COOKIE);
}
