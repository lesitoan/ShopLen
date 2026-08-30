import { Prisma } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import type {
  AdminCustomerListQueryDto,
  UpdateAdminCustomerStatusDto,
} from "@/dto/admin/adminCustomerDto.js";
import {
  toAdminCustomerDetail,
  toAdminCustomerListItem,
} from "@/mappers/admin/adminCustomerMapper.js";
import type {
  AdminCustomerDetail,
  AdminCustomerListItem,
  AdminCustomerListResponse,
} from "@/types/adminCustomer.type.js";
import { AppError } from "@/utils/appError.js";

export const adminCustomerService = {
  async listCustomers(
    query: AdminCustomerListQueryDto,
  ): Promise<AdminCustomerListResponse> {
    const where: Prisma.CustomerWhereInput = {
      ...(query.status ? { status: query.status } : {}),
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
              {
                phone: {
                  contains: query.search,
                },
              },
            ],
          }
        : {}),
    };
    const skip = (query.page - 1) * query.limit;

    const [customers, total] = await prisma.$transaction([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: query.limit,
        select: adminCustomerSelect,
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      items: customers.map(toAdminCustomerListItem),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  },

  async getCustomerDetail(customerId: string): Promise<AdminCustomerDetail> {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: adminCustomerDetailSelect,
    });

    if (!customer) {
      throw new AppError(
        "Không tìm thấy khách hàng.",
        404,
        "CUSTOMER_NOT_FOUND",
      );
    }

    return toAdminCustomerDetail(customer);
  },

  async updateCustomerStatus(
    customerId: string,
    payload: UpdateAdminCustomerStatusDto,
  ): Promise<AdminCustomerListItem> {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true },
    });

    if (!customer) {
      throw new AppError(
        "Không tìm thấy khách hàng.",
        404,
        "CUSTOMER_NOT_FOUND",
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        status: payload.status,
      },
      select: adminCustomerSelect,
    });

    return toAdminCustomerListItem(updatedCustomer);
  },
};

const adminCustomerSelect = {
  id: true,
  code: true,
  fullName: true,
  email: true,
  phone: true,
  gender: true,
  birthday: true,
  avatar: true,
  status: true,
  emailVerified: true,
  isManualLogin: true,
  isGoogleLogin: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CustomerSelect;

const adminCustomerDetailSelect = {
  ...adminCustomerSelect,
  orders: {
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderCode: true,
      customerName: true,
      customerPhone: true,
      totalAmount: true,
      paymentStatus: true,
      orderStatus: true,
      createdAt: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
  },
} satisfies Prisma.CustomerSelect;
