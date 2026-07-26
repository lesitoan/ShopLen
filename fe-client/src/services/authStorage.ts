import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/constants/auth";
import type { AuthTokens } from "@/types/auth.type";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookieUtils";

export function saveAuthTokens(tokens: AuthTokens) {
  setCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, 7);
  setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, 30);
}

export function clearAuthTokens() {
  deleteCookie(ACCESS_TOKEN_COOKIE);
  deleteCookie(REFRESH_TOKEN_COOKIE);
}

export function getAccessToken() {
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken() {
  return getCookie(REFRESH_TOKEN_COOKIE);
}

export function hasAuthTokens() {
  return Boolean(getAccessToken() && getRefreshToken());
}
