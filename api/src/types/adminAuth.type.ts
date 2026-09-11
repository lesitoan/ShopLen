import type { UserRole } from "@prisma/client";

export type AdminSession = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  avatar?: string | null;
  role: UserRole;
  status: "ACTIVE" | "LOCKED";
};

export type AdminAuthData = {
  accessToken: string;
  refreshToken: string;
};

export type AdminRefreshTokenInput = {
  refreshToken: string;
};

export type AdminLogoutInput = {
  refreshToken?: string | null;
};

export type AdminAccessTokenPayload = {
  sub: string;
  tokenType: "ADMIN";
  email: string;
  role: UserRole;
};

export type AdminRefreshTokenPayload = {
  sub: string;
  tokenType: "ADMIN_REFRESH";
  jti: string;
  exp: number;
};
