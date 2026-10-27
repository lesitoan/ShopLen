import crypto from "crypto";
import {
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { Inject, Injectable } from "@nestjs/common";
import { EnvService } from "@/config/env.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { SITE_INFO } from "@/common/constants/siteInfo.js";
import type { SepayWebhookDto } from "@/modules/payments/dto/clientPayment.dto.js";
import { NotificationService } from "@/infrastructure/queues/notification.service.js";
import { EmailService } from "@/infrastructure/email/email.service.js";
import { NOTIFICATION_JOB_NAMES } from "@/infrastructure/queues/types/notification.type.js";
import type { VerifySepaySignaturePayload } from "@/modules/payments/types/payment.type.js";
import { AppError } from "@/common/errors/appError.js";

const ORDER_CODE_PATTERN = new RegExp(
  `${SITE_INFO.bankTransferNotePrefix}[A-Z0-9]+`,
  "i",
);

function buildVietQrUrl(
  env: EnvService["values"],
  params: {
    accountNo: string;
    bankCode: string;
    amount: number;
    transferContent: string;
  },
) {
  const query = new URLSearchParams({
    acc: params.accountNo,
    bank: params.bankCode,
    amount: params.amount.toString(),
    des: params.transferContent,
    template: env.VIETQR_TEMPLATE,
  });

  return `https://vietqr.app/img?${query.toString()}`;
}

function safeCompare(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(firstBuffer, secondBuffer);
}

function normalizeOrderCode(value?: string | null) {
  return value?.trim().toUpperCase() || null;
}

function getOrderCodeCandidates(payload: SepayWebhookDto) {
  const orderCodeCandidates = new Set<string>();
  const code = normalizeOrderCode(payload.code);

  if (code) {
    orderCodeCandidates.add(code);
  }

  const content = `${payload.content ?? ""} ${payload.description ?? ""}`;
  const matchedCode = content.match(ORDER_CODE_PATTERN)?.[0];

  const normalizedMatchedCode = normalizeOrderCode(matchedCode);

  if (normalizedMatchedCode) {
    orderCodeCandidates.add(normalizedMatchedCode);
  }

  return [...orderCodeCandidates];
}

@Injectable()
export class ClientPaymentService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(EnvService) private readonly config: EnvService,
    @Inject(LoggingService) private readonly logging: LoggingService,
    @Inject(EmailService) private readonly email: EmailService,
    @Inject(NotificationService)
    private readonly notifications: NotificationService,
  ) {}
  private async sendOrderPaidEmail(orderId: string) {
    const orderDetailUrl = this.config.values.FRONTEND_URL
      ? `${this.config.values.FRONTEND_URL.replace(/\/$/, "")}/tai-khoan?tab=don-hang`
      : undefined;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        orderCode: true,
        customerName: true,
        customerEmail: true,
        totalAmount: true,
        paidAt: true,
      },
    });

    if (!order?.customerEmail || !order.paidAt) {
      this.logging.logger.warn(
        { orderId, orderCode: order?.orderCode },
        "Skip order paid email because order email data is missing",
      );
      return;
    }

    await this.email.sendOrderPaidEmail({
      to: order.customerEmail,
      orderCode: order.orderCode,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      paidAt: order.paidAt,
      orderDetailUrl: orderDetailUrl,
    });
  }

  async createPaymentQr(orderId: string) {
    if (
      !this.config.values.BANK_ACCOUNT_NUMBER ||
      !this.config.values.BANK_ACCOUNT_NAME ||
      !this.config.values.BANK_CODE
    ) {
      throw new AppError(
        "Chưa cấu hình thông tin ngân hàng.",
        500,
        "BANK_CONFIG_MISSING",
      );
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderCode: true,
        totalAmount: true,
        paymentStatus: true,
        orderStatus: true,
        createdAt: true,
        expiresAt: true,
        payments: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            amount: true,
            transferContent: true,
            qrImageUrl: true,
            bankName: true,
            bankBin: true,
            accountNo: true,
            accountName: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Không tìm thấy đơn hàng.", 404, "ORDER_NOT_FOUND");
    }

    const payment = order.payments[0];

    if (!payment) {
      throw new AppError(
        "Không tìm thấy thông tin thanh toán.",
        404,
        "PAYMENT_NOT_FOUND",
      );
    }

    const qrImageUrl = buildVietQrUrl(this.config.values, {
      accountNo: this.config.values.BANK_ACCOUNT_NUMBER,
      bankCode: this.config.values.BANK_CODE,
      amount: payment.amount,
      transferContent: payment.transferContent,
    });

    if (
      payment.qrImageUrl !== qrImageUrl ||
      payment.bankName !== this.config.values.BANK_CODE ||
      payment.bankBin !== this.config.values.BANK_CODE ||
      payment.accountNo !== this.config.values.BANK_ACCOUNT_NUMBER ||
      payment.accountName !== this.config.values.BANK_ACCOUNT_NAME
    ) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          bankName: this.config.values.BANK_CODE,
          bankBin: this.config.values.BANK_CODE,
          accountNo: this.config.values.BANK_ACCOUNT_NUMBER,
          accountName: this.config.values.BANK_ACCOUNT_NAME,
          qrImageUrl,
        },
      });
    }

    return {
      orderId: order.id,
      orderCode: order.orderCode,
      amount: order.totalAmount,
      transferContent: payment.transferContent,
      bankCode: this.config.values.BANK_CODE,
      accountNo: this.config.values.BANK_ACCOUNT_NUMBER,
      accountName: this.config.values.BANK_ACCOUNT_NAME,
      qrImageUrl,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: payment.createdAt || order.createdAt,
      expiresAt: order.expiresAt,
    };
  }

  verifySepaySignature(payload: VerifySepaySignaturePayload) {
    if (this.config.values.SEPAY_WEBHOOK_AUTH_TYPE === "NONE") {
      return;
    }

    if (!this.config.values.SEPAY_WEBHOOK_SECRET) {
      throw new AppError(
        "Chưa cấu hình secret webhook SePay.",
        500,
        "SEPAY_WEBHOOK_SECRET_MISSING",
      );
    }

    if (!payload.signature || !payload.timestamp || !payload.rawBody) {
      throw new AppError(
        "Webhook SePay thiếu chữ ký.",
        401,
        "SEPAY_SIGNATURE_MISSING",
      );
    }

    const expectedSignature = `sha256=${crypto
      .createHmac("sha256", this.config.values.SEPAY_WEBHOOK_SECRET)
      .update(`${payload.timestamp}.${payload.rawBody}`)
      .digest("hex")}`;

    if (!safeCompare(expectedSignature, payload.signature)) {
      throw new AppError(
        "Chữ ký webhook SePay không hợp lệ.",
        401,
        "SEPAY_SIGNATURE_INVALID",
      );
    }
  }

  async handleSepayWebhook(payload: SepayWebhookDto) {
    const transactionRef =
      payload.referenceCode ?? payload.id?.toString() ?? null;
    const orderCodeCandidates = getOrderCodeCandidates(payload);

    if (orderCodeCandidates.length === 0) {
      return;
    }

    const paidOrderNotification = await this.prisma.$transaction(async (tx) => {
      if (transactionRef) {
        const existedPayment = await tx.payment.findFirst({
          where: {
            provider: PaymentProvider.SEPAY,
            transactionRef,
            status: PaymentStatus.PAID,
          },
          select: { id: true },
        });

        if (existedPayment) {
          return null;
        }
      }

      const payment = await tx.payment.findFirst({
        where: {
          transferContent: { in: orderCodeCandidates },
          status: {
            in: [PaymentStatus.PENDING, PaymentStatus.MISMATCHED],
          },
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderId: true,
          amount: true,
          transferContent: true,
          status: true,
          order: {
            select: {
              id: true,
              orderStatus: true,
              paymentStatus: true,
              expiresAt: true,
            },
          },
        },
      });

      if (!payment) {
        return null;
      }

      const paidAt = payload.transactionDate
        ? new Date(payload.transactionDate)
        : new Date();
      const isMatchedAmount = payload.transferAmount >= payment.amount;

      if (!isMatchedAmount) {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            provider: PaymentProvider.SEPAY,
            transactionRef,
            rawWebhookPayload: payload as Prisma.InputJsonValue,
            isMatched: false,
            status: PaymentStatus.MISMATCHED,
          },
        });
        return null;
      }

      const updatedOrder = await tx.order.updateMany({
        where: {
          id: payment.orderId,
          orderStatus: OrderStatus.PENDING_PAYMENT,
          paymentStatus: PaymentStatus.PENDING,
          expiresAt: { gt: new Date() },
        },
        data: {
          paymentStatus: PaymentStatus.PAID,
          orderStatus: OrderStatus.PAID,
          paidAt,
        },
      });

      if (updatedOrder.count !== 1) {
        return null;
      }

      await tx.payment.updateMany({
        where: {
          id: payment.id,
          status: { in: [PaymentStatus.PENDING, PaymentStatus.MISMATCHED] },
        },
        data: {
          provider: PaymentProvider.SEPAY,
          transactionRef,
          rawWebhookPayload: payload as Prisma.InputJsonValue,
          isMatched: true,
          status: PaymentStatus.PAID,
          paidAt,
        },
      });

      return {
        orderId: payment.orderId,
        orderCode: payment.transferContent,
        paidAt: paidAt.toISOString(),
      };
    });

    if (!paidOrderNotification) {
      return;
    }

    try {
      await this.sendOrderPaidEmail(paidOrderNotification.orderId);
    } catch (error) {
      this.logging.logger.error(
        { err: error, orderId: paidOrderNotification.orderId },
        "Failed to send order paid email",
      );
    }

    await this.notifications.enqueue(
      NOTIFICATION_JOB_NAMES.ORDER_PAID,
      paidOrderNotification,
      {
        orderId: paidOrderNotification.orderId,
        orderCode: paidOrderNotification.orderCode,
      },
    );
  }
}
