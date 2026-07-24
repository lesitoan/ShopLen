import { getSocketServer } from "@/sockets/socketServer.js";

export function emitOrderPaid(orderId: string) {
  getSocketServer()?.emit("order:paid", { orderId });
}

export function emitOrderStatusChanged(orderId: string, orderStatus: string) {
  getSocketServer()?.emit("order:statusChanged", { orderId, orderStatus });
}
