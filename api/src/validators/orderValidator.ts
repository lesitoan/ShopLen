import { z } from "zod";

export const orderIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const createOrderValidator = z.object({
  body: z.object({
    customerName: z.string().min(2),
    customerPhone: z.string().min(8),
    items: z.array(z.object({ productVariantId: z.string(), quantity: z.number().int().positive() })),
  }),
});
