import "dotenv/config";
import { createServer } from "node:http";
import { createApp } from "@/app.js";
import { env } from "@/config/envValidation.js";
import { logger } from "@/config/logger.js";
import { setupSocketServer } from "@/sockets/socketServer.js";

const app = createApp();
const httpServer = createServer(app);

setupSocketServer(httpServer);

httpServer.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "Tiem Len API is running");
});
