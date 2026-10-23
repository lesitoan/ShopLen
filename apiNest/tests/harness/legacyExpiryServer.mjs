import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { mock } from "node:test";

mock.timers.enable({ apis: ["Date"], now: new Date("2026-10-25T07:00:00.000Z") });
const root = process.cwd();
const requireLegacy = createRequire(resolve(root, "package.json"));
const load = (path) => import(pathToFileURL(resolve(root, path)).href);
const { createPaymentState } = await load("../apiNest/tests/fixtures/paymentState.ts");
const state = await createPaymentState();
state.seed.expiresAt = new Date(Date.now() - 1);
const events = [], stock = [], cacheKeys = [];
globalThis.prisma = state.prisma;
globalThis.notificationQueueConnection = { on: () => {} };
globalThis.notificationQueue = { add: async (name, data) => { state.notifications.push({ name, data }); } };
globalThis.redisClient = { isOpen: true, on: () => {}, del: async (keys) => { cacheKeys.push(...keys); } };
const { orderExpiryService } = await load("src/services/orderExpiryService.ts");
const { setupSocketServer } = await load("src/sockets/socketServer.ts");
const { errorHandlerMiddleware } = await load("src/middlewares/errorHandlerMiddleware.ts");
const express = requireLegacy("express");
const app = express();
app.use(express.json({ verify: (request, _response, buffer) => { request.rawBody = buffer.toString("utf8"); } }));
app.use(express.urlencoded({ extended: true }));
app.post("/fixtures/expire", async (_request, response) => {
  const count = await orderExpiryService.expirePendingOrders();
  response.json({ count, orders: [...state.orders.values()], products: [...state.products.values()], events, stock, notifications: state.notifications, cacheKeys });
});
app.use(errorHandlerMiddleware);
const server = app.listen(0, "127.0.0.1", () => process.send({ port: server.address().port }));
const io = setupSocketServer(server), emit = io.emit.bind(io);
io.emit = (name, payload) => {
  if (name === "order:statusChanged") events.push(payload);
  if (name === "stock:update") stock.push(payload);
  return emit(name, payload);
};
process.on("message", (message) => { if (message === "close") io.close(() => process.exit(0)); });
process.on("disconnect", () => io.close());
