import crypto from "crypto";
import {
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { env } from "@/config/envValidation.js";
import { prisma } from "@/config/prismaClient.js";
import { SITE_INFO } from "@/constants/siteInfo.js";
import type { SepayWebhookDto } from "@/dto/client/paymentDto.js";
import { AppError } from "@/utils/appError.js";

type VerifySepaySignaturePayload = {
  signature?: string;
  timestamp?: string;
  rawBody?: string;
};

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

    await prisma.$transaction(async (tx) => {
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
          return;
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
          status: true,
          order: {
            select: {
              id: true,
              orderStatus: true,
              paymentStatus: true,
            },
          },
        },
      });

      if (!payment) {
        return;
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
        return;
      }

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          provider: PaymentProvider.SEPAY,
          transactionRef,
          rawWebhookPayload: payload as Prisma.InputJsonValue,
          isMatched: true,
          status: PaymentStatus.PAID,
          paidAt,
        },
      });

      if (
        payment.order.paymentStatus !== PaymentStatus.PAID &&
        payment.order.orderStatus === OrderStatus.PENDING_PAYMENT
      ) {
        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: PaymentStatus.PAID,
            orderStatus: OrderStatus.PAID,
            paidAt,
          },
        });
      }
    });
  },
};
