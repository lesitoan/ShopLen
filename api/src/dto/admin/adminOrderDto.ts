import { z } from "zod";

const orderStatusDto = z.enum([
  "PENDING_PAYMENT",
  "PAID",
  "PACKING",
  "SHIPPING",
  "COMPLETED",
  "CANCELLATION_REQUESTED",
  "CANCELLED",
]);

const searchQueryDto = z.preprocess((value) => {
  if (value === undefined) {
    return undefined;
  }

  const search = String(value).trim();
  return search.length > 0 ? search : undefined;
}, z.string().min(1).max(120).optional());

export const adminOrderListQueryDto = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
      status: orderStatusDto.optional(),
      startDate: z.string().date().optional(),
      endDate: z.string().date().optional(),
      search: searchQueryDto,
      sort: z
        .enum(["NEWEST", "OLDEST", "PRICE_DESC", "PRICE_ASC"])
        .default("NEWEST"),
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

export type AdminOrderListQueryDto = z.infer<
  typeof adminOrderListQueryDto
>["query"];
