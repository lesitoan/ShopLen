import { rateLimit } from "express-rate-limit";

export const orderLookupRateLimitMiddleware = rateLimit({
  windowMs: 2 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Bạn đã tra cứu quá nhiều lần. Vui lòng thử lại sau ít phút.",
    errorCode: "RATE_LIMIT_EXCEEDED",
  },
});
