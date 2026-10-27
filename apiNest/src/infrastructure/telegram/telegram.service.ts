import { Telegraf } from "telegraf";
import { Inject, Injectable } from "@nestjs/common";
import { EnvService } from "@/config/env.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import type {
  CustomerRegisteredNotificationJobData,
  OrderCancelledNotificationJobData,
  OrderPaidNotificationJobData,
  OrderShippingAddressUpdatedNotificationJobData,
} from "@/infrastructure/queues/types/notification.type.js";
import { formatCurrency } from "@/infrastructure/email/utils/formatCurrency.js";
import { formatDateTime } from "@/infrastructure/email/utils/formatDateTime.js";
import { escapeHtml } from "@/common/utils/htmlEscape.js";

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
    lines.splice(
      -1,
      0,
      `Số tiền: ${escapeHtml(formatCurrency(data.totalAmount))}`,
    );
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

@Injectable()
export class TelegramService {
  private bot: Telegraf | undefined;
  constructor(
    @Inject(EnvService) private readonly config: EnvService,
    @Inject(LoggingService) private readonly logging: LoggingService,
  ) {}

  private isTelegramReady() {
    const env = this.config.values;
    return Boolean(
      env.TELEGRAM_ENABLED &&
      env.TELEGRAM_BOT_TOKEN &&
      this.config.values.TELEGRAM_ADMIN_CHAT_ID,
    );
  }

  private getTelegramBot() {
    const token = this.config.values.TELEGRAM_BOT_TOKEN;
    if (!token) return null;
    return (this.bot ??= new Telegraf(token));
  }

  private async sendTelegramMessage(message: string) {
    if (!this.isTelegramReady()) {
      this.logging.logger.debug("Telegram notification skipped");
      return { sent: false };
    }

    const bot = this.getTelegramBot();

    if (!bot || !this.config.values.TELEGRAM_ADMIN_CHAT_ID) {
      return { sent: false };
    }

    await bot.telegram.sendMessage(
      this.config.values.TELEGRAM_ADMIN_CHAT_ID,
      message,
      {
        parse_mode: "HTML",
      },
    );

    return { sent: true };
  }

  async notifyCustomerRegistered(data: CustomerRegisteredNotificationJobData) {
    if (!this.isTelegramReady()) {
      this.logging.logger.debug(
        { customerId: data.customerId },
        "Telegram customer registration notification skipped",
      );
      return { sent: false };
    }

    return this.sendTelegramMessage(formatCustomerRegisteredMessage(data));
  }

  async notifyOrderPaid(data: OrderPaidNotificationJobData) {
    return this.sendTelegramMessage(formatOrderPaidMessage(data));
  }

  async notifyOrderCancelled(data: OrderCancelledNotificationJobData) {
    return this.sendTelegramMessage(formatOrderCancelledMessage(data));
  }

  async notifyOrderShippingAddressUpdated(
    data: OrderShippingAddressUpdatedNotificationJobData,
  ) {
    return this.sendTelegramMessage(
      formatOrderShippingAddressUpdatedMessage(data),
    );
  }
}
