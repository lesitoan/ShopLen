import { Prisma } from "@prisma/client";
import { addDays, parseISO, startOfDay } from "date-fns";
import { prisma } from "@/config/prismaClient.js";
import { ORDER_STATUS } from "@/constants/orderStatus.js";
import type { AdminOrderListQueryDto } from "@/dto/admin/adminOrderDto.js";
import type { AdminOrderListResponse } from "@/types/adminOrder.type.js";

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

  async getOrderDetail(orderId: string) {
    return { orderId };
  },
  async confirmPayment(orderId: string) {
    return { orderId, orderStatus: ORDER_STATUS.paid };
  },
};
