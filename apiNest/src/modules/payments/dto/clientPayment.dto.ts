import { z } from "zod";

export const sepayWebhookDto = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  gateway: z.string().optional(),
  transactionDate: z.string().optional(),
  accountNumber: z.string().optional(),
  subAccount: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  content: z.string().optional(),
  transferType: z.string().optional(),
  description: z.string().optional(),
  transferAmount: z.coerce.number(),
  accumulated: z.coerce.number().optional(),
  referenceCode: z.string().optional(),
});

export type SepayWebhookDto = z.infer<typeof sepayWebhookDto>;
