import { getSocketServer } from "@/sockets/socketServer.js";

export function emitStockUpdate(productId: string, stock: number) {
  getSocketServer()?.emit("stock:update", { productId, stock });
}
