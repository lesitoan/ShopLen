import {
  OrderStatus,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
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
import type {
  DashboardRevenueQueryDto,
  LowStockProductsQueryDto,
  TopSellingProductsQueryDto,
} from "@/dto/admin/amalyticsDto.js";
import type {
  DashboardRevenueBucket,
  DashboardRevenue,
  DashboardSummary,
  LowStockProducts,
  TopSellingProducts,
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

  async getTopSellingProducts(
    query: TopSellingProductsQueryDto,
  ): Promise<TopSellingProducts> {
    const paidAt: Prisma.DateTimeFilter | undefined =
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

    const topProductStats = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        productId: { not: null },
        order: {
          paymentStatus: PaymentStatus.PAID,
          orderStatus: { not: OrderStatus.CANCELLED },
          ...(paidAt ? { paidAt } : {}),
        },
      },
      _sum: {
        quantity: true,
        totalPrice: true,
      },
      orderBy: [
        {
          _sum: {
            quantity: "desc",
          },
        },
        {
          _sum: {
            totalPrice: "desc",
          },
        },
      ],
      take: query.limit,
    });

    if (topProductStats.length === 0) {
      const fallbackProducts = await prisma.product.findMany({
        where: { deletedAt: null },
        orderBy: [{ soldCount: "desc" }, { createdAt: "desc" }],
        take: query.limit,
        select: {
          id: true,
          code: true,
          name: true,
          slug: true,
          originalPrice: true,
          salePrice: true,
          soldCount: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: [
              { isThumbnail: "desc" },
              { displayOrder: "asc" },
              { createdAt: "asc" },
            ],
            take: 1,
            select: {
              id: true,
              url: true,
              altText: true,
            },
          },
        },
      });

      return {
        items: fallbackProducts.map((p, index) => {
          const thumbnail = p.images[0] ?? null;
          const unitPrice = p.salePrice ?? p.originalPrice;
          return {
            rank: index + 1,
            id: p.id,
            code: p.code,
            name: p.name,
            slug: p.slug,
            category: p.category,
            thumbnail: thumbnail
              ? {
                  id: thumbnail.id,
                  url: thumbnail.url,
                  altText: thumbnail.altText,
                }
              : null,
            soldCount: p.soldCount,
            revenue: p.soldCount * unitPrice,
          };
        }),
      };
    }

    const productIds = topProductStats
      .map((item) => item.productId)
      .filter((productId): productId is string => Boolean(productId));
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        code: true,
        name: true,
        slug: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: [
            { isThumbnail: "desc" },
            { displayOrder: "asc" },
            { createdAt: "asc" },
          ],
          take: 1,
          select: {
            id: true,
            url: true,
            altText: true,
          },
        },
      },
    });
    const productById = new Map(products.map((product) => [product.id, product]));

    return {
      items: topProductStats.flatMap((item, index) => {
        if (!item.productId) {
          return [];
        }

        const product = productById.get(item.productId);

        if (!product) {
          return [];
        }

        const thumbnail = product.images[0] ?? null;

        return {
          rank: index + 1,
          id: product.id,
          code: product.code,
          name: product.name,
          slug: product.slug,
          category: product.category,
          thumbnail: thumbnail
            ? {
                id: thumbnail.id,
                url: thumbnail.url,
                altText: thumbnail.altText,
              }
            : null,
          soldCount: item._sum.quantity ?? 0,
          revenue: item._sum.totalPrice ?? 0,
        };
      }),
    };
  },

  async getLowStockProducts(
    query: LowStockProductsQueryDto,
  ): Promise<LowStockProducts> {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      stockQuantity: {
        lte: query.threshold,
      },
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy: [
          { stockQuantity: "asc" },
          { updatedAt: "desc" },
          { createdAt: "desc" },
        ],
        take: query.limit,
        select: {
          id: true,
          code: true,
          name: true,
          slug: true,
          originalPrice: true,
          salePrice: true,
          stockQuantity: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: [
              { isThumbnail: "desc" },
              { displayOrder: "asc" },
              { createdAt: "asc" },
            ],
            take: 1,
            select: {
              id: true,
              url: true,
              altText: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      threshold: query.threshold,
      total,
      items: products.map((product) => {
        const thumbnail = product.images[0] ?? null;

        return {
          id: product.id,
          code: product.code,
          name: product.name,
          slug: product.slug,
          category: product.category,
          thumbnail: thumbnail
            ? {
                id: thumbnail.id,
                url: thumbnail.url,
                altText: thumbnail.altText,
              }
            : null,
          stockLeft: product.stockQuantity,
          price: product.salePrice ?? product.originalPrice,
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
        };
      }),
    };
  },
};
