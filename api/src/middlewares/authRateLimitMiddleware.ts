import { rateLimit } from "express-rate-limit";

const rateLimitMessage = {
  success: false,
  message: "Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau.",
  errorCode: "RATE_LIMIT_EXCEEDED",
};

export const loginRateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});

export const passwordRecoveryRateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});

export const refreshRateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});
