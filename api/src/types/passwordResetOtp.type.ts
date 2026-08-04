export type PasswordResetOtpCache = {
  customerId: string;
  email: string;
  otpHash: string;
  attempts: number;
  verifiedAt: string | null;
  createdAt: string;
};
