import { z } from "zod";

export const cartProductListDto = z.object({
  body: z.object({
    ids: z.array(z.string().uuid()).min(1).max(100),
  }),
});

export type CartProductListDto = z.infer<typeof cartProductListDto>["body"];
