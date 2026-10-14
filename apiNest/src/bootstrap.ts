import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "@/app.module.js";
import { EnvService } from "@/config/env.service.js";

export async function createApplication() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const config = app.get(EnvService);

  app.setGlobalPrefix("api/v1", { exclude: ["health"] });
  app.use(helmet());
  app.enableCors({ origin: config.values.CORS_ORIGINS, credentials: true });
  app.enableShutdownHooks();

  return app;
}
