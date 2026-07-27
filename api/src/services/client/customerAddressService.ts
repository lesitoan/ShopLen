import { prisma } from "@/config/prismaClient.js";
import type {
  CreateCustomerAddressRequestDto,
  UpdateCustomerAddressRequestDto,
} from "@/dto/client/customerAddressDto.js";
import { AppError } from "@/utils/appError.js";

export const customerAddressService = {
  async listAddresses(customerId: string) {
    return prisma.customerAddress.findMany({
      where: { customerId },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        fullName: true,
        phone: true,
        provinceName: true,
        districtName: true,
        wardName: true,
        addressLine: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async createAddress(
    customerId: string,
    payload: CreateCustomerAddressRequestDto,
  ) {
    await prisma.$transaction(async (transaction) => {
      const addressCount = await transaction.customerAddress.count({
        where: { customerId },
      });
      const shouldSetDefault = payload.isDefault === true || addressCount === 0;

      if (shouldSetDefault) {
        await transaction.customerAddress.updateMany({
          where: { customerId, isDefault: true },
          data: { isDefault: false },
        });
      }

      await transaction.customerAddress.create({
        data: {
          customerId,
          fullName: payload.fullName,
          phone: payload.phone,
          provinceName: payload.provinceName,
          addressLine: payload.addressLine,
          districtName: payload.districtName,
          wardName: payload.wardName,
          isDefault: shouldSetDefault,
        },
      });
    });
  },

  async updateAddress(
    customerId: string,
    addressId: string,
    payload: UpdateCustomerAddressRequestDto,
  ) {
    const address = await prisma.customerAddress.findFirst({
      where: {
        id: addressId,
        customerId,
      },
    });

    if (!address) {
      throw new AppError(
        "Địa chỉ không tồn tại.",
        404,
        "CUSTOMER_ADDRESS_NOT_FOUND",
      );
    }

    await prisma.$transaction(async (transaction) => {
      if (payload.isDefault) {
        await transaction.customerAddress.updateMany({
          where: { customerId, isDefault: true },
          data: { isDefault: false },
        });
      }

      await transaction.customerAddress.update({
        where: { id: address.id },
        data: { isDefault: payload.isDefault },
      });
    });
  },

  async deleteAddress(customerId: string, addressId: string) {
    const address = await prisma.customerAddress.findFirst({
      where: {
        id: addressId,
        customerId,
      },
    });

    if (!address) {
      throw new AppError(
        "Địa chỉ không tồn tại.",
        404,
        "CUSTOMER_ADDRESS_NOT_FOUND",
      );
    }

    await prisma.customerAddress.delete({
      where: { id: address.id },
    });
  },
};
