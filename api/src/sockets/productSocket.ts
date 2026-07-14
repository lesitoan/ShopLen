import { getSocketServer } from "./socketServer.js";

export function emitStockUpdate(productVariantId: string, stock: number) {
  getSocketServer()?.emit("stock:update", { productVariantId, stock });
}
