import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { EnvService } from "@/config/env.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { TelegramService } from "@/infrastructure/telegram/telegram.service.js";
import { NotificationProcessor } from "@/infrastructure/queues/notification.processor.js";
import { queueJobOptions } from "@/infrastructure/queues/queueOptions.js";
import type { NotificationJobData } from "@/infrastructure/queues/types/notification.type.js";

const legacyNotificationJobs: Array<{ name: string; data: NotificationJobData }> = [
  { name: "CUSTOMER_REGISTERED", data: { customerId: "c", code: "CUS1", fullName: "<Khách & Bạn>", email: "test@example.test", phone: "0901", registerMethod: "GOOGLE", registeredAt: "2026-10-25T07:00:00Z" } },
  { name: "ORDER_PAID", data: { orderId: "o", orderCode: "DH1", customerName: "<Khách & Bạn>", customerPhone: "0901", totalAmount: 100000, paidAt: "2026-10-25T07:00:00Z" } },
  { name: "ORDER_CANCELLED", data: { orderId: "o", orderCode: "DH1", orderStatus: "CANCELLATION_REQUESTED", reason: "<Lý do &>", cancelledAt: "2026-10-25T07:00:00Z" } },
  { name: "ORDER_SHIPPING_ADDRESS_UPDATED", data: { orderId: "o", orderCode: "DH1", oldShippingAddress: "<Cũ>", newShippingAddress: "Mới & Bạn", updatedAt: "2026-10-25T07:00:00Z" } },
];

test("legacy notification jobs keep Telegram HTML, enable flags and failure propagation for BullMQ retries", async () => {
  const logging = { logger: { debug() {}, warn() {} } } as unknown as LoggingService;
  const config = new EnvService();
  Object.assign(config.values, { TELEGRAM_ENABLED: true, TELEGRAM_BOT_TOKEN: "test-token", TELEGRAM_ADMIN_CHAT_ID: "test-chat" });
  const telegram = new TelegramService(config, logging);
  const messages: string[] = [];
  let fail = false;
  Reflect.set(telegram, "bot", { telegram: { sendMessage: async (chatId: string, message: string, options: unknown) => {
    assert.equal(chatId, "test-chat"); assert.deepEqual(options, { parse_mode: "HTML" });
    if (fail) throw new Error("Telegram unavailable");
    messages.push(message);
  } } });
  const processor = new NotificationProcessor(telegram, logging);
  for (const job of legacyNotificationJobs) await processor.process(job);
  assert.equal(messages.length, 4);
  assert.match(messages[0]!, /&lt;Khách &amp; Bạn&gt;/);
  assert.match(messages[0]!, /Google/);
  assert.match(messages[1]!, /ĐƠN HÀNG ĐÃ THANH TOÁN/);
  assert.match(messages[2]!, /KHÁCH YÊU CẦU HỦY ĐƠN/);
  assert.match(messages[3]!, /&lt;Cũ&gt;/);
  fail = true;
  await assert.rejects(processor.process(legacyNotificationJobs[1]!), /Telegram unavailable/);
  fail = false;
  await processor.process(legacyNotificationJobs[1]!);
  assert.equal(messages.length, 5);
  config.values.TELEGRAM_ENABLED = false;
  for (const job of legacyNotificationJobs) await processor.process(job);
  await processor.process({ name: "UNKNOWN", data: legacyNotificationJobs[0]!.data });
  assert.equal(messages.length, 5);
  assert.deepEqual(queueJobOptions, { attempts: 3, backoff: { type: "exponential", delay: 10000 }, removeOnComplete: { age: 86400, count: 500 }, removeOnFail: { age: 604800, count: 1000 } });
});
