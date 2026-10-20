import { Inject, Injectable, type OnApplicationBootstrap, type OnModuleDestroy } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Server } from "socket.io";
import { EnvService } from "@/config/env.service.js";

@Injectable()
export class RealtimeService implements OnApplicationBootstrap, OnModuleDestroy {
  private server: Server | undefined;

  constructor(@Inject(HttpAdapterHost) private readonly adapter: HttpAdapterHost, @Inject(EnvService) private readonly config: EnvService) {}

  onApplicationBootstrap() {
    this.server = new Server(this.adapter.httpAdapter.getHttpServer(), { cors: { origin: this.config.values.CORS_ORIGINS, credentials: true } });
    this.server.on("connection", (socket) => { socket.emit("connected", { socketId: socket.id }); });
  }

  emitOrderStatusChanged(orderId: string, orderStatus: string) {
    this.server?.emit("order:statusChanged", { orderId, orderStatus });
  }

  async onModuleDestroy() {
    const server = this.server;
    if (server) await new Promise<void>((resolve) => server.close(() => resolve()));
    this.server = undefined;
  }
}
