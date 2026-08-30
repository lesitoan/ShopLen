import { z } from "zod";

const accountStatusDto = z.enum(["ACTIVE", "LOCKED"]);
const userRoleDto = z.enum(["ADMIN", "STAFF_ORDER", "STAFF_CONTENT"]);
const userRoleFilterDto = z.enum([
  "SUPER_ADMIN",
  "ADMIN",
  "STAFF_ORDER",
  "STAFF_CONTENT",
]);

const searchQueryDto = z.preprocess((value) => {
  if (value === undefined) {
    return undefined;
  }

  const search = String(value).trim();
  return search.length > 0 ? search : undefined;
}, z.string().min(1).max(120).optional());

const nullableTextDto = (max: number) =>
  z
    .union([z.string().trim().max(max), z.literal(""), z.null()])
    .optional()
    .transform((value) => (value === "" ? null : value));

export const adminUserListQueryDto = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: accountStatusDto.optional(),
    role: userRoleFilterDto.optional(),
    search: searchQueryDto,
  }),
});

export const adminUserParamsDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createAdminUserDto = z
  .object({
    body: z.object({
      code: z.string().trim().min(1).max(30).optional(),
      fullName: z.string().trim().min(1).max(120),
      email: z
        .string()
        .trim()
        .email()
        .max(255)
        .transform((value) => value.toLowerCase()),
      phone: nullableTextDto(20),
      avatar: nullableTextDto(2000),
      role: userRoleDto.default("STAFF_ORDER"),
      status: accountStatusDto.default("ACTIVE"),
      pw: z.string().min(8).max(100),
      pwConfirm: z.string().min(8).max(100),
    }),
  })
  .refine((value) => value.body.pw === value.body.pwConfirm, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["body", "pwConfirm"],
  });

export const updateAdminUserDto = z
  .object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      code: z.string().trim().min(1).max(30).optional(),
      fullName: z.string().trim().min(1).max(120).optional(),
      email: z
        .string()
        .trim()
        .email()
        .max(255)
        .transform((value) => value.toLowerCase())
        .optional(),
      phone: nullableTextDto(20),
      avatar: nullableTextDto(2000),
      role: userRoleDto.optional(),
      status: accountStatusDto.optional(),
    }),
  })
  .refine(
    (value) =>
      Object.values(value.body).some((fieldValue) => fieldValue !== undefined),
    {
      message: "Vui lòng nhập ít nhất một thông tin cần cập nhật.",
      path: ["body"],
    },
  );

export const updateAdminUserPasswordDto = z
  .object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      pw: z.string().min(8).max(100),
      pwConfirm: z.string().min(8).max(100),
    }),
  })
  .refine((value) => value.body.pw === value.body.pwConfirm, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["body", "pwConfirm"],
  });

export type AdminUserListQueryDto = z.infer<
  typeof adminUserListQueryDto
>["query"];

export type CreateAdminUserDto = z.infer<typeof createAdminUserDto>["body"];

export type UpdateAdminUserDto = z.infer<typeof updateAdminUserDto>["body"];

export type UpdateAdminUserPasswordDto = z.infer<
  typeof updateAdminUserPasswordDto
>["body"];
