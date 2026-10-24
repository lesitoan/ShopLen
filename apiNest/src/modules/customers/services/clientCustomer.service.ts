import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import type {
  ChangePasswordRequestDto,
  UpdateCustomerProfileRequestDto,
} from "@/modules/auth/dto/clientAuth.dto.js";
import { CloudinaryService } from "@/infrastructure/cloudinary/cloudinary.service.js";
import { toCustomerSession } from "@/modules/auth/mappers/clientAuthMapper.js";
import { AppError } from "@/common/errors/appError.js";
import { comparePassword, hashPassword } from "@/modules/auth/security/hashPassword.js";
import { RefreshSessionService } from "@/modules/auth/services/refreshSession.service.js";

@Injectable()
export class ClientCustomerService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(CloudinaryService) private readonly cloudinary: CloudinaryService,
    @Inject(RefreshSessionService) private readonly sessions: RefreshSessionService,
  ) {}
  async getMe(customerId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer || customer.status !== "ACTIVE") {
      throw new AppError(
        "Tài khoản không tồn tại hoặc đã bị khóa.",
        403,
        "CUSTOMER_LOCKED",
      );
    }

    return toCustomerSession(customer);
  }

  async updateMe(customerId: string, payload: UpdateCustomerProfileRequestDto) {
    const birthday =
      payload.birthday === undefined || payload.birthday === null
        ? payload.birthday
        : new Date(payload.birthday);

    const customer = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        fullName: payload.fullName,
        phone: payload.phone === "" ? null : payload.phone,
        gender: payload.gender,
        birthday,
      },
    });

    return toCustomerSession(customer);
  }

  async updateAvatar(customerId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new AppError("Vui lòng chọn ảnh avatar.", 400, "AVATAR_FILE_REQUIRED");
    }

    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer || customer.status !== "ACTIVE") {
      throw new AppError(
        "Tài khoản không tồn tại hoặc đã bị khóa.",
        403,
        "CUSTOMER_LOCKED",
      );
    }

    const uploadedImage = await this.cloudinary.uploadImageBuffer(
      file,
      "avatars",
    );

    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { avatar: uploadedImage.url },
    });
  }

  async changePassword(customerId: string, payload: ChangePasswordRequestDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });

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

    await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash: await hashPassword(payload.newPassword),
        isManualLogin: true,
      },
    });

    await this.sessions.revokeAll("CUSTOMER", customer.id);
  }
}
