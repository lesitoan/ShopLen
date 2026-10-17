import { z } from "zod";

const accountStatusDto = z.enum(["ACTIVE", "LOCKED"]);

const searchQueryDto = z.preprocess((value) => {
  if (value === undefined) {
    return undefined;
  }

  const search = String(value).trim();
  return search.length > 0 ? search : undefined;
}, z.string().min(1).max(120).optional());

export const adminCustomerListQueryDto = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: searchQueryDto,
    status: accountStatusDto.optional(),
  }),
});

export const adminCustomerParamsDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateAdminCustomerStatusDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: accountStatusDto,
  }),
});

export type AdminCustomerListQueryDto = z.infer<
  typeof adminCustomerListQueryDto
>["query"];

export type UpdateAdminCustomerStatusDto = z.infer<
  typeof updateAdminCustomerStatusDto
>["body"];
