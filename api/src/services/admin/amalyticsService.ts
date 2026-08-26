import {
  addDays,
  addHours,
  eachDayOfInterval,
  eachHourOfInterval,
  format,
  parseISO,
  startOfDay,
} from "date-fns";
import { prisma } from "@/config/prismaClient.js";
import type { DashboardRevenueQueryDto } from "@/dto/admin/amalyticsDto.js";
import type {
  DashboardRevenueBucket,
  DashboardRevenue,
  DashboardSummary,
} from "@/types/adminAmalytics.type.js";

function createDashboardRevenueBuckets(
  query: DashboardRevenueQueryDto,
): DashboardRevenueBucket[] {
  const start = startOfDay(parseISO(query.startDate));
  const end = addDays(startOfDay(parseISO(query.endDate)), 1);

  if (query.startDate === query.endDate) {
    return eachHourOfInterval({ start, end: addHours(end, -1) }).map((date) => ({
      label: format(date, "HH:mm"),
      start: date,
      end: addHours(date, 1),
    }));
  }

  return eachDayOfInterval({ start, end: addDays(end, -1) }).map((date) => ({
    label: format(date, "dd/MM"),
    start: date,
    end: addDays(date, 1),
  }));
}

export const amalyticsService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const [
      revenueToday,
      newOrdersToday,
      pendingPaymentOrders,
      newCustomersToday,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          paymentStatus: "PAID",
          paidAt: {
            gte: start,
            lt: end,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: start,
            lt: end,
          },
        },
      }),
      prisma.order.count({
        where: {
          orderStatus: "PENDING_PAYMENT",
        },
      }),
      prisma.customer.count({
        where: {
          createdAt: {
            gte: start,
            lt: end,
          },
        },
      }),
    ]);

    return {
      revenueToday: revenueToday._sum.totalAmount ?? 0,
      newOrdersToday,
      pendingPaymentOrders,
      newCustomersToday,
    };
  },

  async getDashboardRevenue(
    query: DashboardRevenueQueryDto,
  ): Promise<DashboardRevenue> {
    const buckets = createDashboardRevenueBuckets(query);
    const points = await Promise.all(
      buckets.map(async (bucket) => {
        const [revenue, orders] = await Promise.all([
          prisma.order.aggregate({
            where: {
              paymentStatus: "PAID",
              paidAt: {
                gte: bucket.start,
                lt: bucket.end,
              },
            },
            _sum: {
              totalAmount: true,
            },
          }),
          prisma.order.count({
            where: {
              createdAt: {
                gte: bucket.start,
                lt: bucket.end,
              },
            },
          }),
        ]);

        return {
          label: bucket.label,
          revenue: revenue._sum.totalAmount ?? 0,
          orders,
        };
      }),
    );

    return {
      startDate: query.startDate,
      endDate: query.endDate,
      points,
    };
  },
};
