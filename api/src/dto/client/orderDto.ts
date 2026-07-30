import { z } from "zod";

const selectedOptionDto = z.object({
  optionType: z.enum(["COLOR", "SIZE"]),
  code: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .transform((value) => value.toUpperCase()),
});

const createOrderItemDto = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(999),
  selectedOptions: z.array(selectedOptionDto).max(2).optional(),
});

export const createOrderDto = z.object({
  body: z.object({
    items: z.array(createOrderItemDto).min(1).max(100),
    customerName: z.string().trim().min(1).max(120),
    customerPhone: z.string().trim().min(1).max(20),
    customerEmail: z.string().trim().email().max(255).optional(),
    shippingAddress: z.string().trim().min(1).max(500),
    shippingProvince: z.string().trim().max(120).optional(),
    shippingDistrict: z.string().trim().max(120).optional(),
    shippingWard: z.string().trim().max(120).optional(),
    customerNote: z.string().trim().max(1000).optional(),
    shippingFee: z.coerce.number().int().min(0).default(0),
  }),
});

export type CreateOrderRequestDto = z.infer<typeof createOrderDto>["body"];
export type CreateOrderItemDto = CreateOrderRequestDto["items"][number];
