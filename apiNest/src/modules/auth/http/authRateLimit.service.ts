import { Injectable } from "@nestjs/common";
import { rateLimit } from "express-rate-limit";

const message = {
  success: false,
  message: "Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau.",
  errorCode: "RATE_LIMIT_EXCEEDED",
};

@Injectable()
export class AuthRateLimitService {
  readonly login = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message,
  });
  readonly recovery = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message,
  });
  readonly refresh = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message,
  });
}
