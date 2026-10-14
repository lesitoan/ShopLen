import pino, { type DestinationStream, type LoggerOptions } from "pino";
import type { EnvService } from "@/config/env.service.js";

export function createLogger(config: EnvService["values"], destination?: DestinationStream) {
  const options: LoggerOptions = {
    level: config.LOG_LEVEL,
    base: { service: "tiemLenApi", environment: config.NODE_ENV },
    redact: {
      paths: [
        "req.headers.authorization", "req.headers.cookie", "res.headers.set-cookie",
        "*.password", "*.token", "*.accessToken", "*.refreshToken", "*.otpCode",
      ],
      censor: "[REDACTED]",
    },
    transport: !destination && config.NODE_ENV === "development"
      ? { target: "pino-pretty", options: {
          colorize: true,
          ignore: "pid,hostname,service,environment,req,res,method,path,statusCode",
          singleLine: true, translateTime: "SYS:standard",
        } }
      : undefined,
  };
  return destination ? pino(options, destination) : pino(options);
}
