import { z } from "zod";

export const adminUploadImageQueryDto = z.object({
  query: z.object({
    target: z.enum(["CATEGORY", "PRODUCT", "BLOG"]),
  }),
});

export type AdminUploadImageQueryDto = z.infer<
  typeof adminUploadImageQueryDto
>["query"];
