export type AuthViewMode = "LANDING" | "LOGIN" | "REGISTER" | "FORGOT_PASSWORD";

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordStep1Data {
  email: string;
}

export interface ForgotPasswordStep2Data {
  email: string;
  otpCode: string;
  newPassword: string;
}
