import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "@/config/envValidation.js";
import { errorHandlerMiddleware } from "@/middlewares/errorHandlerMiddleware.js";
import { routes } from "@/routes/index.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    }),
  );
  app.use(
    express.json({
      verify: (request, _response, buffer) => {
        (request as express.Request).rawBody = buffer.toString("utf8"); // để validate sepay
      },
    }),
  );
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_request, response) => {
    response.json({ ok: true, service: "tiemLenApi" });
  });

  app.use("/api/v1", routes);
  app.use(errorHandlerMiddleware);

  return app;
}
