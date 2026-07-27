import { z } from "zod";

export const createCustomerAddressDto = z.object({
  body: z.object({
    fullName: z.string().trim().min(1).max(120),
    phone: z.string().trim().min(8).max(20),
    provinceName: z.string().trim().min(1).max(120),
    addressLine: z.string().trim().min(1),
    districtName: z.string().trim().min(1).max(120).optional(),
    wardName: z.string().trim().min(1).max(120).optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const updateCustomerAddressDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    isDefault: z.boolean(),
  }),
});

export const deleteCustomerAddressDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateCustomerAddressRequestDto = z.infer<
  typeof createCustomerAddressDto
>["body"];
export type UpdateCustomerAddressRequestDto = z.infer<
  typeof updateCustomerAddressDto
>["body"];
