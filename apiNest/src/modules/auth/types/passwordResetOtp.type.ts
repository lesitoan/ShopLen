export type PasswordResetOtpCache = {
    customerId: string;
    email: string;
    otpHash: string;
    attempts: number;
    verifiedAt: string | null;
    createdAt: string;
};
export type CreatePasswordOtp = {
    customerId: string;
    email: string;
    otpCode: string;
    ttlSeconds: number;
};
export type VerifyPasswordOtp = {
    email: string;
    otpCode: string;
    maxAttempts: number;
    markVerified: boolean;
};
