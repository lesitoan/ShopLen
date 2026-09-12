import crypto from "crypto";
import {
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { env } from "@/config/envValidation.js";
import { logger } from "@/config/logger.js";
import { prisma } from "@/config/prismaClient.js";
import { SITE_INFO } from "@/constants/siteInfo.js";
import type { SepayWebhookDto } from "@/dto/client/paymentDto.js";
import { enqueueNotification } from "@/queues/notificationQueue.js";
import { emailService } from "@/services/emailService.js";
import { NOTIFICATION_JOB_NAMES } from "@/types/notification.type.js";
import type { VerifySepaySignaturePayload } from "@/types/payment.type.js";
import { AppError } from "@/utils/appError.js";

const ORDER_CODE_PATTERN = new RegExp(
  `${SITE_INFO.bankTransferNotePrefix}[A-Z0-9]+`,
  "i",
);

function buildVietQrUrl(params: {
  accountNo: string;
  bankCode: string;
  amount: number;
  transferContent: string;
}) {
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

async function sendOrderPaidEmail(orderId: string) {
  const orderDetailUrl = env.FRONTEND_URL
    ? `${env.FRONTEND_URL.replace(/\/$/, "")}/tai-khoan?tab=don-hang`
    : undefined;

  const order = await prisma.order.findUnique({
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
    logger.warn(
      { orderId, orderCode: order?.orderCode },
      "Skip order paid email because order email data is missing",
    );
    return;
  }

  await emailService.sendOrderPaidEmail({
    to: order.customerEmail,
    orderCode: order.orderCode,
    customerName: order.customerName,
    totalAmount: order.totalAmount,
    paidAt: order.paidAt,
    orderDetailUrl: orderDetailUrl,
  });
}

export const paymentService = {
  async createPaymentQr(orderId: string) {
    if (!env.BANK_ACCOUNT_NUMBER || !env.BANK_ACCOUNT_NAME || !env.BANK_CODE) {
      throw new AppError(
        "Chưa cấu hình thông tin ngân hàng.",
        500,
        "BANK_CONFIG_MISSING",
      );
    }

    const order = await prisma.order.findUnique({
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

    const qrImageUrl = buildVietQrUrl({
      accountNo: env.BANK_ACCOUNT_NUMBER,
      bankCode: env.BANK_CODE,
      amount: payment.amount,
      transferContent: payment.transferContent,
    });

    if (
      payment.qrImageUrl !== qrImageUrl ||
      payment.bankName !== env.BANK_CODE ||
      payment.bankBin !== env.BANK_CODE ||
      payment.accountNo !== env.BANK_ACCOUNT_NUMBER ||
      payment.accountName !== env.BANK_ACCOUNT_NAME
    ) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          bankName: env.BANK_CODE,
          bankBin: env.BANK_CODE,
          accountNo: env.BANK_ACCOUNT_NUMBER,
          accountName: env.BANK_ACCOUNT_NAME,
          qrImageUrl,
        },
      });
    }

    return {
      orderId: order.id,
      orderCode: order.orderCode,
      amount: order.totalAmount,
      transferContent: payment.transferContent,
      bankCode: env.BANK_CODE,
      accountNo: env.BANK_ACCOUNT_NUMBER,
      accountName: env.BANK_ACCOUNT_NAME,
      qrImageUrl,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: payment.createdAt || order.createdAt,
      expiresAt: order.expiresAt,
    };
  },

  verifySepaySignature(payload: VerifySepaySignaturePayload) {
    if (env.SEPAY_WEBHOOK_AUTH_TYPE === "NONE") {
      return;
    }

    if (!env.SEPAY_WEBHOOK_SECRET) {
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
      .createHmac("sha256", env.SEPAY_WEBHOOK_SECRET)
      .update(`${payload.timestamp}.${payload.rawBody}`)
      .digest("hex")}`;

    if (!safeCompare(expectedSignature, payload.signature)) {
      throw new AppError(
        "Chữ ký webhook SePay không hợp lệ.",
        401,
        "SEPAY_SIGNATURE_INVALID",
      );
    }
  },

  async handleSepayWebhook(payload: SepayWebhookDto) {
    const transactionRef = payload.referenceCode ?? payload.id?.toString() ?? null;
    const orderCodeCandidates = getOrderCodeCandidates(payload);

    if (orderCodeCandidates.length === 0) {
      return;
    }

    const paidOrderNotification = await prisma.$transaction(async (tx) => {
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
      await sendOrderPaidEmail(paidOrderNotification.orderId);
    } catch (error) {
      logger.error(
        { err: error, orderId: paidOrderNotification.orderId },
        "Failed to send order paid email",
      );
    }

    await enqueueNotification(
      NOTIFICATION_JOB_NAMES.ORDER_PAID,
      paidOrderNotification,
      {
        orderId: paidOrderNotification.orderId,
        orderCode: paidOrderNotification.orderCode,
      },
    );
  },
};
