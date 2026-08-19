export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";

export type AdminSession = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  avatar?: string | null;
  role: UserRole;
  status: "ACTIVE" | "LOCKED";
};

export type AdminAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AdminLoginRequest = {
  email: string;
  password: string;
};

export type AdminRefreshTokenRequest = {
  refreshToken: string;
};

export type AdminLogoutRequest = {
  refreshToken?: string;
};
