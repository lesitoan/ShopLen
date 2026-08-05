import { Telegraf } from "telegraf";
import { env } from "@/config/envValidation.js";
import { logger } from "@/config/logger.js";
import type {
  CustomerRegisteredNotificationJobData,
  OrderCancelledNotificationJobData,
  OrderPaidNotificationJobData,
  OrderShippingAddressUpdatedNotificationJobData,
} from "@/types/notification.type.js";
import { formatCurrency } from "@/utils/formatCurrency.js";
import { formatDateTime } from "@/utils/formatDateTime.js";
import { escapeHtml } from "@/utils/htmlEscape.js";

const globalForTelegram = globalThis as unknown as {
  telegramBot?: Telegraf;
};

function getTelegramBot() {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return null;
  }

  const bot =
    globalForTelegram.telegramBot ?? new Telegraf(env.TELEGRAM_BOT_TOKEN);

  if (process.env.NODE_ENV !== "production") {
    globalForTelegram.telegramBot = bot;
  }

  return bot;
}

function isTelegramReady() {
  return Boolean(
    env.TELEGRAM_ENABLED &&
      env.TELEGRAM_BOT_TOKEN &&
      env.TELEGRAM_ADMIN_CHAT_ID,
  );
}

function formatCustomerRegisteredMessage(
  data: CustomerRegisteredNotificationJobData,
) {
  const registeredAt = formatDateTime(data.registeredAt);

  const lines = [
    "<b>KHÁCH HÀNG MỚI ĐĂNG KÍ</b>",
    `Mã khách: ${escapeHtml(data.code)}`,
    `Tên: ${escapeHtml(data.fullName)}`,
    `Email: ${escapeHtml(data.email)}`,
    `Hình thức: ${data.registerMethod === "GOOGLE" ? "Google" : "Email"}`,
    `Thời gian: ${escapeHtml(registeredAt)}`,
  ];

  if (data.phone) {
    lines.push(`SĐT: ${escapeHtml(data.phone)}`);
  }

  return lines.join("\n");
}

function formatOrderPaidMessage(data: OrderPaidNotificationJobData) {
  const lines = [
    "<b>ĐƠN HÀNG ĐÃ THANH TOÁN</b>",
    `Mã đơn: ${escapeHtml(data.orderCode)}`,
    `Thời gian: ${escapeHtml(formatDateTime(data.paidAt))}`,
  ];

  if (data.customerName) {
    lines.splice(2, 0, `Khách: ${escapeHtml(data.customerName)}`);
  }

  if (data.customerPhone) {
    lines.splice(3, 0, `SĐT: ${escapeHtml(data.customerPhone)}`);
  }

  if (typeof data.totalAmount === "number") {
    lines.splice(-1, 0, `Số tiền: ${escapeHtml(formatCurrency(data.totalAmount))}`);
  }

  return lines.join("\n");
}

function formatOrderCancelledMessage(data: OrderCancelledNotificationJobData) {
  const title =
    data.orderStatus === "CANCELLED"
      ? "ĐƠN HÀNG ĐÃ HỦY"
      : "KHÁCH YÊU CẦU HỦY ĐƠN";

  return [
    `<b>${title}</b>`,
    data.orderCode ? `Mã đơn: ${escapeHtml(data.orderCode)}` : null,
    data.customerName ? `Khách: ${escapeHtml(data.customerName)}` : null,
    data.customerPhone ? `SĐT: ${escapeHtml(data.customerPhone)}` : null,
    typeof data.totalAmount === "number"
      ? `Tổng tiền: ${escapeHtml(formatCurrency(data.totalAmount))}`
      : null,
    `Lý do: ${escapeHtml(data.reason)}`,
    `Thời gian: ${escapeHtml(formatDateTime(data.cancelledAt))}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

function formatOrderShippingAddressUpdatedMessage(
  data: OrderShippingAddressUpdatedNotificationJobData,
) {
  return [
    "<b>KHÁCH HÀNG CẬP NHẬT ĐỊA CHỈ GIAO HÀNG</b>",
    data.orderCode ? `Mã đơn: ${escapeHtml(data.orderCode)}` : null,
    data.customerName ? `Khách: ${escapeHtml(data.customerName)}` : null,
    data.customerPhone ? `SĐT: ${escapeHtml(data.customerPhone)}` : null,
    `Địa chỉ cũ: ${escapeHtml(data.oldShippingAddress)}`,
    `Địa chỉ mới: ${escapeHtml(data.newShippingAddress)}`,
    `Thời gian: ${escapeHtml(formatDateTime(data.updatedAt))}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

async function sendTelegramMessage(message: string) {
  if (!isTelegramReady()) {
    logger.debug("Telegram notification skipped");
    return { sent: false };
  }

  const bot = getTelegramBot();

  if (!bot || !env.TELEGRAM_ADMIN_CHAT_ID) {
    return { sent: false };
  }

  await bot.telegram.sendMessage(env.TELEGRAM_ADMIN_CHAT_ID, message, {
    parse_mode: "HTML",
  });

  return { sent: true };
}

export const telegramService = {
  async notifyCustomerRegistered(data: CustomerRegisteredNotificationJobData) {
    if (!isTelegramReady()) {
      logger.debug(
        { customerId: data.customerId },
        "Telegram customer registration notification skipped",
      );
      return { sent: false };
    }

    return sendTelegramMessage(formatCustomerRegisteredMessage(data));
  },

  async notifyOrderPaid(data: OrderPaidNotificationJobData) {
    return sendTelegramMessage(formatOrderPaidMessage(data));
  },

  async notifyOrderCancelled(data: OrderCancelledNotificationJobData) {
    return sendTelegramMessage(formatOrderCancelledMessage(data));
  },

  async notifyOrderShippingAddressUpdated(
    data: OrderShippingAddressUpdatedNotificationJobData,
  ) {
    return sendTelegramMessage(formatOrderShippingAddressUpdatedMessage(data));
  },
};
