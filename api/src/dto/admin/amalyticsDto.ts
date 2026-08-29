import { z } from "zod";

const MAX_DASHBOARD_REVENUE_RANGE_DAYS = 31;
const DAY_TIME = 24 * 60 * 60 * 1000;

function getRangeDays(startDate: string, endDate: string) {
  return (
    Math.floor(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / DAY_TIME,
    ) + 1
  );
}

export const dashboardRevenueQueryDto = z.object({
  query: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date(),
    })
    .refine((value) => value.startDate <= value.endDate, {
      message: "startDate phải nhỏ hơn hoặc bằng endDate.",
      path: ["endDate"],
    })
    .refine(
      (value) =>
        getRangeDays(value.startDate, value.endDate) <=
        MAX_DASHBOARD_REVENUE_RANGE_DAYS,
      {
        message: "Khoảng thời gian thống kê tối đa là 1 tháng.",
        path: ["endDate"],
      }
    ),
});

export const topSellingProductsQueryDto = z.object({
  query: z
    .object({
      limit: z.coerce.number().int().min(1).max(50).default(5),
      startDate: z.string().date().optional(),
      endDate: z.string().date().optional(),
    })
    .refine(
      (value) =>
        !value.startDate ||
        !value.endDate ||
        value.startDate <= value.endDate,
      {
        message: "startDate phải nhỏ hơn hoặc bằng endDate.",
        path: ["endDate"],
      },
    ),
});

export const lowStockProductsQueryDto = z.object({
  query: z.object({
    threshold: z.coerce.number().int().min(0).max(999).default(5),
    limit: z.coerce.number().int().min(1).max(50).default(5),
  }),
});

export type DashboardRevenueQueryDto = z.infer<
  typeof dashboardRevenueQueryDto
>["query"];

export type TopSellingProductsQueryDto = z.infer<
  typeof topSellingProductsQueryDto
>["query"];

export type LowStockProductsQueryDto = z.infer<
  typeof lowStockProductsQueryDto
>["query"];
