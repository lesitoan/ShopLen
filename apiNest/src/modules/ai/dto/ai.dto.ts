import { z } from "zod";

export const aiProductsDto = z.object({ query: z.object({ cursor: z.string().uuid().optional(), limit: z.coerce.number().int().min(1).max(100).default(50) }) });
export const aiResolveDto = z.object({ body: z.object({ ids: z.array(z.string().uuid()).min(1).max(30) }) });
export const aiChatDto = z.object({ body: z.object({
  message: z.string().trim().min(1).max(1200),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(3000) })).max(8).default([]),
}).superRefine((value, ctx) => {
  if (value.history.length % 2 || value.history.some((item, i) => item.role !== (i % 2 ? "assistant" : "user"))) ctx.addIssue({code: z.ZodIssueCode.custom, message: "Lịch sử phải gồm các cặp user/assistant."});
}) });
export type AiProductsDto = z.infer<typeof aiProductsDto>["query"];
export type AiResolveDto = z.infer<typeof aiResolveDto>["body"];
export type AiChatDto = z.infer<typeof aiChatDto>["body"];
