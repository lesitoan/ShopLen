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

export type DashboardRevenueQueryDto = z.infer<
  typeof dashboardRevenueQueryDto
>["query"];
