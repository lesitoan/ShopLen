import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import { enqueueNotification } from "@/queues/notificationQueue.js";
import { invalidateHomeProductCache } from "@/services/client/products/productHomeCacheService.js";
import { emitOrderStatusChanged } from "@/sockets/orderSocket.js";
import { emitStockUpdate } from "@/sockets/productSocket.js";
import { NOTIFICATION_JOB_NAMES } from "@/types/notification.type.js";

const ORDER_EXPIRY_BATCH_SIZE = 100;
const MAX_BATCHES_PER_RUN = 10;
const ORDER_EXPIRY_REASON = "Đơn hàng đã hết hạn thanh toán.";

async function expireOrder(orderId: string, now: Date) {
  return prisma.$transaction(
    async (transaction) => {
      const order = await transaction.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          orderCode: true,
          customerName: true,
          customerPhone: true,
          totalAmount: true,
          items: {
            select: {
              productId: true,
              quantity: true,
            },
          },
        },
      });

      if (!order) {
        return null;
      }

      const expiredOrder = await transaction.order.updateMany({
        where: {
          id: orderId,
          orderStatus: OrderStatus.PENDING_PAYMENT,
          paymentStatus: PaymentStatus.PENDING,
          expiresAt: { lte: now },
        },
        data: {
          orderStatus: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.FAILED,
          cancelledAt: now,
          cancelReason: ORDER_EXPIRY_REASON,
        },
      });

      if (expiredOrder.count !== 1) {
        return null;
      }

      await transaction.payment.updateMany({
        where: {
          orderId,
          status: { in: [PaymentStatus.PENDING, PaymentStatus.MISMATCHED] },
        },
        data: { status: PaymentStatus.FAILED },
      });

      const stockUpdates = [];
      const orderItems = order.items
        .filter((item) => item.productId !== null)
        .sort((first, second) => first.productId!.localeCompare(second.productId!));

      for (const item of orderItems) {
        const product = await transaction.product.update({
          where: { id: item.productId! },
          data: {
            stockQuantity: { increment: item.quantity },
          },
          select: {
            id: true,
            stockQuantity: true,
          },
        });

        stockUpdates.push(product);
      }

      return {
        order,
        stockUpdates,
      };
    },
    { timeout: 15_000 },
  );
}

export const orderExpiryService = {
  async expirePendingOrders() {
    const expiredOrders = [];

    for (let batchNumber = 0; batchNumber < MAX_BATCHES_PER_RUN; batchNumber += 1) {
      const now = new Date();
      const orderIds = await prisma.order.findMany({
        where: {
          orderStatus: OrderStatus.PENDING_PAYMENT,
          paymentStatus: PaymentStatus.PENDING,
          expiresAt: { lte: now },
        },
        orderBy: { expiresAt: "asc" },
        take: ORDER_EXPIRY_BATCH_SIZE,
        select: { id: true },
      });

      if (orderIds.length === 0) {
        break;
      }

      for (const { id } of orderIds) {
        const expiredOrder = await expireOrder(id, now);

        if (expiredOrder) {
          expiredOrders.push(expiredOrder);
        }
      }

      if (orderIds.length < ORDER_EXPIRY_BATCH_SIZE) {
        break;
      }
    }

    if (expiredOrders.length === 0) {
      return 0;
    }

    await invalidateHomeProductCache();

    for (const { order, stockUpdates } of expiredOrders) {
      emitOrderStatusChanged(order.id, OrderStatus.CANCELLED);

      for (const product of stockUpdates) {
        emitStockUpdate(product.id, product.stockQuantity);
      }

      await enqueueNotification(
        NOTIFICATION_JOB_NAMES.ORDER_CANCELLED,
        {
          orderId: order.id,
          orderCode: order.orderCode,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          totalAmount: order.totalAmount,
          orderStatus: OrderStatus.CANCELLED,
          reason: ORDER_EXPIRY_REASON,
          cancelledAt: new Date().toISOString(),
        },
        {
          orderId: order.id,
          orderCode: order.orderCode,
          reason: "payment_expired",
        },
      );
    }

    return expiredOrders.length;
  },
};
