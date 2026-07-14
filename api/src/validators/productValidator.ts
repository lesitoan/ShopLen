import { z } from "zod";

export const productIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
