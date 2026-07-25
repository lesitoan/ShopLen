import { prisma } from "@/config/prismaClient.js";
import type {
  ChangePasswordRequestDto,
  UpdateCustomerProfileRequestDto,
} from "@/dto/client/authDto.js";
import { toCustomerSession } from "@/services/client/authService.js";
import { AppError } from "@/utils/appError.js";
import { comparePassword, hashPassword } from "@/utils/hashPassword.js";

export const customerService = {
  async getMe(customerId: string) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer || customer.status !== "ACTIVE") {
      throw new AppError(
        "Tài khoản không tồn tại hoặc đã bị khóa.",
        403,
        "CUSTOMER_LOCKED",
      );
    }

    return toCustomerSession(customer);
  },

  async updateMe(customerId: string, payload: UpdateCustomerProfileRequestDto) {
    const birthday =
      payload.birthday === undefined || payload.birthday === null
        ? payload.birthday
        : new Date(payload.birthday);

    const customer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        fullName: payload.fullName,
        phone: payload.phone === "" ? null : payload.phone,
        gender: payload.gender,
        birthday,
        avatar: payload.avatar,
      },
    });

    return toCustomerSession(customer);
  },

  async changePassword(customerId: string, payload: ChangePasswordRequestDto) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer || customer.status !== "ACTIVE") {
      throw new AppError(
        "Tài khoản không tồn tại hoặc đã bị khóa.",
        403,
        "CUSTOMER_LOCKED",
      );
    }

    if (customer.isManualLogin) {
      if (!payload.currentPassword || !customer.passwordHash) {
        throw new AppError(
          "Vui lòng nhập mật khẩu hiện tại.",
          400,
          "CURRENT_PASSWORD_REQUIRED",
        );
      }

      const isCurrentPasswordValid = await comparePassword(
        payload.currentPassword,
        customer.passwordHash,
      );

      if (!isCurrentPasswordValid) {
        throw new AppError(
          "Mật khẩu hiện tại không đúng.",
          400,
          "INVALID_CREDENTIALS",
        );
      }
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash: await hashPassword(payload.newPassword),
        isManualLogin: true,
      },
    });

    return { changed: true };
  },
};
