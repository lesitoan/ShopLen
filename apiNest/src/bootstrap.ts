import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "@/app.module.js";
import { EnvService } from "@/config/env.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { createRequestLogger } from "@/common/middlewares/requestLogger.js";
import { ApiExceptionFilter } from "@/common/filters/apiException.filter.js";

export async function createApplication() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bufferLogs: true,
  });
  const config = app.get(EnvService);
  const logging = app.get(LoggingService);

  app.setGlobalPrefix("api/v1", { exclude: ["health"] });
  app.use(helmet());
  app.useLogger(logging);
  app.use(createRequestLogger(logging.logger));
  app.useGlobalFilters(new ApiExceptionFilter(config, logging));
  app.enableCors({ origin: config.values.CORS_ORIGINS, credentials: true });
  app.enableShutdownHooks();

  return app;
}
