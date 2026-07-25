export type CustomerSession = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  phone?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  birthday?: string | null;
  avatar?: string | null;
  status: "ACTIVE" | "LOCKED";
  isManualLogin: boolean;
  isGoogleLogin: boolean;
  rewardPoints: number;
  totalSpent: number;
  totalOrders: number;
};

export type AuthData = {
  customer: CustomerSession;
  accessToken: string;
  refreshToken: string;
};

export type CustomerAccessTokenPayload = {
  sub: string;
  tokenType: "CUSTOMER";
  email: string;
};

export type CustomerRefreshTokenPayload = {
  sub: string;
  tokenType: "CUSTOMER_REFRESH";
};

export type GoogleProfile = {
  sub: string;
  email: string;
  emailVerified: boolean;
  fullName?: string;
  avatar?: string;
};
