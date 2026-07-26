export type AuthViewMode = "LANDING" | "LOGIN" | "REGISTER" | "FORGOT_PASSWORD";

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

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSession = AuthTokens;

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type GoogleLoginRequest = {
  idToken: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type VerifyPasswordOtpRequest = {
  email: string;
  otpCode: string;
};

export type ResetPasswordRequest = {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
};

export type LoginFormData = LoginRequest & {
  rememberMe?: boolean;
};

export type RegisterFormData = RegisterRequest;

export type ForgotPasswordEmailFormData = ForgotPasswordRequest;

export type ForgotPasswordOtpFormData = VerifyPasswordOtpRequest;

export type ForgotPasswordResetFormData = {
  newPassword: string;
  confirmPassword: string;
};
