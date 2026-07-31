import pino from "pino";
import { env } from "@/config/envValidation.js";

const isProduction = env.NODE_ENV === "production";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: "tiemLenApi",
    environment: env.NODE_ENV,
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers.set-cookie",
      "*.password",
      "*.token",
      "*.accessToken",
      "*.refreshToken",
      "*.otpCode",
    ],
    censor: "[REDACTED]",
  },
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore:
            "pid,hostname,service,environment,req,res,method,path,statusCode",
          singleLine: true,
          translateTime: "SYS:standard",
        },
      },
});
