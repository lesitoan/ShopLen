import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { Test } from "@nestjs/testing";
import { RealtimeModule } from "@/infrastructure/realtime/realtime.module.js";
import { RealtimeService } from "@/infrastructure/realtime/realtime.service.js";

test("Socket.IO retains default path, connected payload and order status broadcast with graceful shutdown", async () => {
  const module = await Test.createTestingModule({ imports: [RealtimeModule] }).compile();
  const app = module.createNestApplication();
  await app.listen(0, "127.0.0.1");
  const url = `${await app.getUrl()}/socket.io/?EIO=4&transport=polling`;
  try {
    const opening = await (await fetch(url)).text();
    const sid = JSON.parse(opening.slice(1)).sid;
    const session = `${url}&sid=${sid}`;
    await fetch(session, { method: "POST", headers: { "content-type": "text/plain" }, body: "40" });
    const connected = await (await fetch(session)).text();
    assert.match(connected, /42\["connected",\{"socketId":"[^"]+"\}\]/);
    app.get(RealtimeService).emitOrderStatusChanged("test-order", "CANCELLED");
    const event = await (await fetch(session)).text();
    assert.equal(event, '42["order:statusChanged",{"orderId":"test-order","orderStatus":"CANCELLED"}]');
    await fetch(session, { method: "POST", headers: { "content-type": "text/plain" }, body: "41" });
  } finally { await app.close(); }
});
