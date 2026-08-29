import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { addDays, parseISO, startOfDay } from "date-fns";
import { prisma } from "@/config/prismaClient.js";
import type {
  AdminOrderListQueryDto,
  UpdateAdminOrderStatusDto,
} from "@/dto/admin/adminOrderDto.js";
import { toAdminOrderDetail } from "@/mappers/admin/adminOrderMapper.js";
import { enqueueNotification } from "@/queues/notificationQueue.js";
import {
  emitOrderPaid,
  emitOrderStatusChanged,
} from "@/sockets/orderSocket.js";
import type {
  AdminOrderDetail,
  AdminOrderListResponse,
} from "@/types/adminOrder.type.js";
import { NOTIFICATION_JOB_NAMES } from "@/types/notification.type.js";
import { AppError } from "@/utils/appError.js";

export const adminOrderService = {
  async listOrders(query: AdminOrderListQueryDto): Promise<AdminOrderListResponse> {
    const createdAt: Prisma.DateTimeFilter | undefined =
      query.startDate || query.endDate
        ? {
            ...(query.startDate
              ? { gte: startOfDay(parseISO(query.startDate)) }
              : {}),
            ...(query.endDate
              ? { lt: addDays(startOfDay(parseISO(query.endDate)), 1) }
              : {}),
          }
        : undefined;
    const where: Prisma.OrderWhereInput = {
      ...(query.status ? { orderStatus: query.status } : {}),
      ...(createdAt ? { createdAt } : {}),
      ...(query.search
        ? {
            OR: [
              {
                orderCode: {
                  contains: query.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                customerName: {
                  contains: query.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                customerPhone: {
                  contains: query.search,
                },
              },
            ],
          }
        : {}),
    };
    const orderBy: Prisma.OrderOrderByWithRelationInput =
      query.sort === "OLDEST"
        ? { createdAt: "asc" }
        : query.sort === "PRICE_DESC"
          ? { totalAmount: "desc" }
          : query.sort === "PRICE_ASC"
            ? { totalAmount: "asc" }
            : { createdAt: "desc" };
    const skip = (query.page - 1) * query.limit;

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        select: {
          id: true,
          orderCode: true,
          customerName: true,
          customerPhone: true,
          totalAmount: true,
          paymentStatus: true,
          orderStatus: true,
          createdAt: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      items: orders.map((order) => ({
        id: order.id,
        orderCode: order.orderCode,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt.toISOString(),
        itemsCount: order._count.items,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  },

  async getOrderDetail(orderId: string): Promise<AdminOrderDetail> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: adminOrderDetailSelect,
    });

    if (!order) {
      throw new AppError("Không tìm thấy đơn hàng.", 404, "ORDER_NOT_FOUND");
    }

    return toAdminOrderDetail(order);
  },

  async updateOrderStatus(
    orderId: string,
    payload: UpdateAdminOrderStatusDto,
  ): Promise<AdminOrderDetail> {
    const order = await prisma.$transaction(async (transaction) => {
      const currentOrder = await transaction.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          orderCode: true,
          customerName: true,
          customerPhone: true,
          totalAmount: true,
          paymentStatus: true,
          orderStatus: true,
          items: {
            select: {
              productId: true,
              quantity: true,
            },
          },
        },
      });

      if (!currentOrder) {
        throw new AppError("Không tìm thấy đơn hàng.", 404, "ORDER_NOT_FOUND");
      }

      if (
        currentOrder.orderStatus === OrderStatus.CANCELLED &&
        payload.orderStatus !== OrderStatus.CANCELLED
      ) {
        throw new AppError(
          "Không thể đổi trạng thái đơn hàng đã hủy.",
          409,
          "ORDER_STATUS_INVALID",
        );
      }

      if (
        payload.orderStatus === OrderStatus.CANCELLED &&
        !payload.cancelReason?.trim()
      ) {
        throw new AppError(
          "Vui lòng nhập lý do hủy đơn.",
          422,
          "ORDER_CANCELLATION_REASON_REQUIRED",
        );
      }

      const shouldMarkPaymentPaid =
        currentOrder.paymentStatus !== PaymentStatus.PAID &&
        (payload.orderStatus === OrderStatus.PAID ||
          payload.orderStatus === OrderStatus.PACKING ||
          payload.orderStatus === OrderStatus.SHIPPING ||
          payload.orderStatus === OrderStatus.COMPLETED);
      const paidAt = shouldMarkPaymentPaid ? new Date() : undefined;
      const shouldCancelOrder =
        payload.orderStatus === OrderStatus.CANCELLED &&
        currentOrder.orderStatus !== OrderStatus.CANCELLED;

      if (shouldCancelOrder) {
        for (const item of currentOrder.items) {
          if (!item.productId) {
            continue;
          }

          await transaction.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: { increment: item.quantity },
            },
          });
        }
      }

      await transaction.order.update({
        where: { id: orderId },
        data: {
          orderStatus: payload.orderStatus,
          ...(paidAt
            ? {
                paymentStatus: PaymentStatus.PAID,
                paidAt,
              }
            : {}),
          ...(payload.orderStatus === OrderStatus.CANCELLED
            ? {
                paymentStatus:
                  currentOrder.paymentStatus === PaymentStatus.PAID
                    ? PaymentStatus.PAID
                    : PaymentStatus.FAILED,
                cancelledAt: new Date(),
                cancelReason: payload.cancelReason,
              }
            : {}),
          ...(payload.adminNotes !== undefined
            ? { adminNotes: payload.adminNotes }
            : {}),
          ...(payload.shippingUnit !== undefined
            ? { shippingUnit: payload.shippingUnit }
            : {}),
          ...(payload.trackingCode !== undefined
            ? { trackingCode: payload.trackingCode }
            : {}),
        },
      });

      if (paidAt) {
        await transaction.payment.updateMany({
          where: {
            orderId,
            status: {
              in: [PaymentStatus.PENDING, PaymentStatus.MISMATCHED],
            },
          },
          data: {
            isMatched: true,
            status: PaymentStatus.PAID,
            paidAt,
          },
        });
      }

      if (
        payload.orderStatus === OrderStatus.CANCELLED &&
        currentOrder.paymentStatus !== PaymentStatus.PAID
      ) {
        await transaction.payment.updateMany({
          where: {
            orderId,
            status: {
              in: [PaymentStatus.PENDING, PaymentStatus.MISMATCHED],
            },
          },
          data: {
            status: PaymentStatus.FAILED,
          },
        });
      }

      const updatedOrder = await transaction.order.findUnique({
        where: { id: orderId },
        select: adminOrderDetailSelect,
      });

      if (!updatedOrder) {
        throw new AppError("Không tìm thấy đơn hàng.", 404, "ORDER_NOT_FOUND");
      }

      return {
        currentOrder,
        updatedOrder,
        paidAt,
      };
    });

    emitOrderStatusChanged(orderId, order.updatedOrder.orderStatus);

    if (order.paidAt) {
      emitOrderPaid(orderId);
      await enqueueNotification(
        NOTIFICATION_JOB_NAMES.ORDER_PAID,
        {
          orderId,
          orderCode: order.currentOrder.orderCode,
          customerName: order.currentOrder.customerName,
          customerPhone: order.currentOrder.customerPhone,
          totalAmount: order.currentOrder.totalAmount,
          paidAt: order.paidAt.toISOString(),
        },
        {
          orderId,
          orderCode: order.currentOrder.orderCode,
        },
      );
    }

    if (order.updatedOrder.orderStatus === OrderStatus.CANCELLED) {
      await enqueueNotification(
        NOTIFICATION_JOB_NAMES.ORDER_CANCELLED,
        {
          orderId,
          orderCode: order.currentOrder.orderCode,
          customerName: order.currentOrder.customerName,
          customerPhone: order.currentOrder.customerPhone,
          totalAmount: order.currentOrder.totalAmount,
          orderStatus: OrderStatus.CANCELLED,
          reason: payload.cancelReason ?? "",
          cancelledAt: new Date().toISOString(),
        },
        {
          orderId,
          orderCode: order.currentOrder.orderCode,
        },
      );
    }

    return toAdminOrderDetail(order.updatedOrder);
  },

  async confirmPayment(orderId: string): Promise<AdminOrderDetail> {
    return adminOrderService.updateOrderStatus(orderId, {
      orderStatus: OrderStatus.PAID,
    });
  },
};

const adminOrderDetailSelect = {
  id: true,
  orderCode: true,
  customerId: true,
  customerName: true,
  customerPhone: true,
  customerEmail: true,
  shippingAddress: true,
  shippingProvince: true,
  shippingDistrict: true,
  shippingWard: true,
  customerNote: true,
  adminNotes: true,
  subtotal: true,
  shippingFee: true,
  discountAmount: true,
  pointsDiscount: true,
  totalAmount: true,
  usedPoints: true,
  earnedPoints: true,
  paymentMethod: true,
  paymentStatus: true,
  orderStatus: true,
  expiresAt: true,
  paidAt: true,
  cancelledAt: true,
  cancelReason: true,
  cancellationRequestedAt: true,
  cancellationRequestedFrom: true,
  cancellationRequestReason: true,
  shippingUnit: true,
  trackingCode: true,
  createdAt: true,
  updatedAt: true,
  customer: {
    select: {
      id: true,
      code: true,
      fullName: true,
      email: true,
      phone: true,
    },
  },
  items: {
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      productId: true,
      unitPrice: true,
      quantity: true,
      totalPrice: true,
      productSnapshot: true,
      createdAt: true,
    },
  },
  payments: {
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      provider: true,
      method: true,
      bankName: true,
      bankBin: true,
      accountNo: true,
      accountName: true,
      amount: true,
      transferContent: true,
      qrImageUrl: true,
      transactionRef: true,
      isMatched: true,
      status: true,
      paidAt: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.OrderSelect;
