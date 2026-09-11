import { randomInt } from "node:crypto";
import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import type {
  AdminUserListQueryDto,
  CreateAdminUserDto,
  UpdateAdminUserDto,
  UpdateAdminUserPasswordDto,
} from "@/dto/admin/adminUserDto.js";
import { toAdminUserItem } from "@/mappers/admin/adminUserMapper.js";
import type { AdminSession } from "@/types/adminAuth.type.js";
import type {
  AdminUserItem,
  AdminUserListResponse,
} from "@/types/adminUser.type.js";
import { AppError } from "@/utils/appError.js";
import { hashPassword } from "@/utils/hashPassword.js";
import { refreshSessionService } from "@/services/refreshSessionService.js";

export const adminUserService = {
  async listUsers(query: AdminUserListQueryDto): Promise<AdminUserListResponse> {
    const where: Prisma.UserWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.role ? { role: query.role } : {}),
      ...(query.search
        ? {
            OR: [
              {
                fullName: {
                  contains: query.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                email: {
                  contains: query.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };
    const skip = (query.page - 1) * query.limit;

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: query.limit,
        select: adminUserSelect,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items: users.map(toAdminUserItem),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  },

  async getUserDetail(userId: string, actor: AdminSession): Promise<AdminUserItem> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: adminUserSelect,
    });

    if (!user) {
      throw new AppError("Không tìm thấy nhân viên.", 404, "USER_NOT_FOUND");
    }

    if (
      actor.role !== UserRole.SUPER_ADMIN &&
      (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN)
    ) {
      throw new AppError(
        "Bạn không có quyền chỉnh sửa tài khoản quản trị này.",
        403,
        "FORBIDDEN_ADMIN_ACCOUNT_MANAGEMENT",
      );
    }

    return toAdminUserItem(user);
  },

  async createUser(
    payload: CreateAdminUserDto,
    actor: AdminSession,
  ): Promise<AdminUserItem> {
    if (actor.role !== UserRole.SUPER_ADMIN && payload.role === UserRole.ADMIN) {
      throw new AppError(
        "Bạn không có quyền cấp vai trò admin.",
        403,
        "FORBIDDEN_ADMIN_ROLE_MANAGEMENT",
      );
    }

    try {
      const user = await prisma.user.create({
        data: {
          code: payload.code ?? `USR${Date.now()}${randomInt(100, 999)}`,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          avatar: payload.avatar,
          role: payload.role,
          status: payload.status,
          passwordHash: await hashPassword(payload.pw),
        },
        select: adminUserSelect,
      });

      return toAdminUserItem(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Email, số điện thoại hoặc mã nhân viên đã tồn tại.",
          409,
          "USER_UNIQUE_CONSTRAINT",
          error.message,
        );
      }

      throw error;
    }
  },

  async updateUser(
    userId: string,
    payload: UpdateAdminUserDto,
    actor: AdminSession,
  ): Promise<AdminUserItem> {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!targetUser) {
      throw new AppError("Không tìm thấy nhân viên.", 404, "USER_NOT_FOUND");
    }

    if (
      actor.role !== UserRole.SUPER_ADMIN &&
      (targetUser.role === UserRole.SUPER_ADMIN ||
        targetUser.role === UserRole.ADMIN)
    ) {
      throw new AppError(
        "Bạn không có quyền chỉnh sửa tài khoản quản trị này.",
        403,
        "FORBIDDEN_ADMIN_ACCOUNT_MANAGEMENT",
      );
    }

    if (
      payload.role !== undefined &&
      actor.role !== UserRole.SUPER_ADMIN &&
      payload.role === UserRole.ADMIN
    ) {
      throw new AppError(
        "Bạn không có quyền cấp vai trò admin.",
        403,
        "FORBIDDEN_ADMIN_ROLE_MANAGEMENT",
      );
    }

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(payload.code !== undefined ? { code: payload.code } : {}),
          ...(payload.fullName !== undefined
            ? { fullName: payload.fullName }
            : {}),
          ...(payload.email !== undefined ? { email: payload.email } : {}),
          ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
          ...(payload.avatar !== undefined ? { avatar: payload.avatar } : {}),
          ...(payload.role !== undefined ? { role: payload.role } : {}),
          ...(payload.status !== undefined ? { status: payload.status } : {}),
        },
        select: adminUserSelect,
      });

      return toAdminUserItem(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Email, số điện thoại hoặc mã nhân viên đã tồn tại.",
          409,
          "USER_UNIQUE_CONSTRAINT",
          error.message,
        );
      }

      throw error;
    }
  },

  async updateUserPassword(
    userId: string,
    payload: UpdateAdminUserPasswordDto,
    actor: AdminSession,
  ) {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!targetUser) {
      throw new AppError("Không tìm thấy nhân viên.", 404, "USER_NOT_FOUND");
    }

    if (
      actor.role !== UserRole.SUPER_ADMIN &&
      (targetUser.role === UserRole.SUPER_ADMIN ||
        targetUser.role === UserRole.ADMIN)
    ) {
      throw new AppError(
        "Bạn không có quyền chỉnh sửa tài khoản quản trị này.",
        403,
        "FORBIDDEN_ADMIN_ACCOUNT_MANAGEMENT",
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: await hashPassword(payload.pw),
      },
      select: {
        id: true,
      },
    });

    await refreshSessionService.revokeAll("ADMIN", userId);

    return { updated: true };
  },

  async deleteUser(userId: string, actor: AdminSession) {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!targetUser) {
      throw new AppError("Không tìm thấy nhân viên.", 404, "USER_NOT_FOUND");
    }

    if (
      actor.role !== UserRole.SUPER_ADMIN &&
      (targetUser.role === UserRole.SUPER_ADMIN ||
        targetUser.role === UserRole.ADMIN)
    ) {
      throw new AppError(
        "Bạn không có quyền chỉnh sửa tài khoản quản trị này.",
        403,
        "FORBIDDEN_ADMIN_ACCOUNT_MANAGEMENT",
      );
    }

    try {
      await prisma.user.delete({
        where: { id: userId },
        select: {
          id: true,
        },
      });

      return { deleted: true };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new AppError(
          "Không thể xóa nhân viên vì dữ liệu này đang được sử dụng.",
          409,
          "USER_IN_USE",
          error.message,
        );
      }

      throw error;
    }
  },
};

const adminUserSelect = {
  id: true,
  code: true,
  fullName: true,
  email: true,
  phone: true,
  avatar: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;
