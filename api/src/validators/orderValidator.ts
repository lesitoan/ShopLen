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
    items: z.array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        selectedOptions: z.record(z.string(), z.string()).optional(),
      }),
    ),
  }),
});
