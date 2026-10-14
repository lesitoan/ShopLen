import { z } from "zod";

export const requestSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    colors: z.preprocess(
      (value) => value === undefined ? [] : String(value).split(","),
      z.array(z.string().trim().transform((value) => value.toUpperCase())),
    ),
    home: z.preprocess((value) => value === "1" || value === "true", z.boolean()),
  }),
  body: z.object({ name: z.string().trim().min(1), note: z.string().nullable().optional() }),
});

export type RequestFixture = z.infer<typeof requestSchema>;
