import { ResourceDrainService } from "@/infrastructure/lifecycle/resourceDrain.service.js";
import {
  Inject,
  Injectable,
  Optional,
  type OnApplicationBootstrap,
  type OnModuleDestroy,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Server } from "socket.io";
import { EnvService } from "@/config/env.service.js";

@Injectable()
export class RealtimeService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private server: Server | undefined;

  constructor(
    @Inject(HttpAdapterHost) private readonly adapter: HttpAdapterHost,
    @Inject(EnvService) private readonly config: EnvService,
    @Optional()
    @Inject(ResourceDrainService)
    private readonly drain?: ResourceDrainService,
  ) {}

  onApplicationBootstrap() {
    this.server = new Server(this.adapter.httpAdapter.getHttpServer(), {
      cors: { origin: this.config.values.CORS_ORIGINS, credentials: true },
    });
    this.server.on("connection", (socket) => {
      socket.emit("connected", { socketId: socket.id });
    });
  }

  emitOrderStatusChanged(orderId: string, orderStatus: string) {
    this.server?.emit("order:statusChanged", { orderId, orderStatus });
  }

  emitOrderPaid(orderId: string) {
    this.server?.emit("order:paid", { orderId });
  }

  emitStockUpdate(productId: string, stock: number) {
    this.server?.emit("stock:update", { productId, stock });
  }

  async onModuleDestroy() {
    await this.drain?.drain();
    const server = this.server;
    if (server)
      await new Promise<void>((resolve) => server.close(() => resolve()));
    this.server = undefined;
  }
}
