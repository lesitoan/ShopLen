import "dotenv/config";
import { createServer } from "node:http";
import { createApp } from "@/app.js";
import { env } from "@/config/envValidation.js";
import { setupSocketServer } from "@/sockets/socketServer.js";

const app = createApp();
const httpServer = createServer(app);

setupSocketServer(httpServer);

httpServer.listen(env.PORT, () => {
  console.log(`Tiệm Len API is running on port ${env.PORT}`);
});
