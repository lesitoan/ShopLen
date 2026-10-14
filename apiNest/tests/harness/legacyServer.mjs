import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const legacyRoot = process.cwd();
const requireLegacy = createRequire(resolve(legacyRoot, "package.json"));
const express = requireLegacy("express");
const multer = requireLegacy("multer");
const load = (path) => import(pathToFileURL(resolve(legacyRoot, path)).href);
const { sendSuccess, sendCreated, sendPaginated } = await load("src/utils/httpResponse.ts");
const { AppError } = await load("src/utils/appError.ts");
const { validateMiddleware } = await load("src/middlewares/validateMiddleware.ts");
const { errorHandlerMiddleware } = await load("src/middlewares/errorHandlerMiddleware.ts");
const { requestLoggerMiddleware } = await load("src/middlewares/requestLoggerMiddleware.ts");
const { requestSchema } = await load("../apiNest/tests/fixtures/requestSchema.ts");
const { fixtureValue } = await load("../apiNest/tests/fixtures/httpCases.ts");
const app = express();
app.use(requestLoggerMiddleware);
app.use(express.json({ verify: (request, _response, buffer) => { request.rawBody = buffer.toString("utf8"); } }));
app.get("/health", (_request, response) => response.json({ ok: true, service: "tiemLenApi" }));
app.get("/api/v1/fixtures/success", (request, response) => sendSuccess(response, fixtureValue(request.query.value)));
app.post("/api/v1/fixtures/created", (_request, response) => sendCreated(response, { id: "fixture-created" }));
app.get("/api/v1/fixtures/paginated", (_request, response) => sendPaginated(response, [], { page: 1, limit: 20, total: 0 }));
app.get("/api/v1/fixtures/featured", (_request, response) => response.json({ success: true, message: "Thanh cong.", data: null }));
app.get("/api/v1/fixtures/missing-blog", (_request, response) => response.status(404).json({ success: false, message: "Không tìm thấy bài viết.", data: null }));
app.post("/api/v1/fixtures/webhook", (request, response) => {
  if (request.rawBody !== '{ "amount": 100 }') throw new AppError("Raw body changed", 400, "RAW_BODY_CHANGED");
  response.json({ success: true });
});
app.get("/api/v1/fixtures/error", () => { throw new AppError("Không hợp lệ.", 409, "FIXTURE_CONFLICT", "fixture-private"); });
app.get("/api/v1/fixtures/unhandled", () => { throw new Error("fixture-error"); });
app.get("/api/v1/fixtures/upload-error", () => { throw new multer.MulterError("LIMIT_FILE_SIZE"); });
app.post("/api/v1/fixtures/request/:id", validateMiddleware(requestSchema), (request, response) => {
  sendSuccess(response, { body: request.body, query: request.query, params: request.params });
});
app.use(errorHandlerMiddleware);
const server = app.listen(0, "127.0.0.1", () => process.send({ port: server.address().port }));
process.on("message", (message) => {
  if (message === "close") server.close(() => process.exit(0));
});
process.on("disconnect", () => server.close());
