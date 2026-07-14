import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/envValidation.js";

let socketServer: Server | null = null;

export function setupSocketServer(httpServer: HttpServer) {
  socketServer = new Server(httpServer, {
    cors: {
      origin: [env.CLIENT_URL, env.ADMIN_URL],
      credentials: true,
    },
  });

  socketServer.on("connection", (socket) => {
    socket.emit("connected", { socketId: socket.id });
  });

  return socketServer;
}

export function getSocketServer() {
  return socketServer;
}
