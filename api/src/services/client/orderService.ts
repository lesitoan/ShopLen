import {
  OrderStatus,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  ProductOptionType,
  ProductStatus,
  Prisma,
} from "@prisma/client";
import { env } from "@/config/envValidation.js";
import { prisma } from "@/config/prismaClient.js";
import { MESSAGES } from "@/constants/messages.js";
import type {
  CreateOrderItemDto,
  CreateOrderRequestDto,
  ListOrdersQueryDto,
  LookupOrderRequestDto,
} from "@/dto/client/orderDto.js";
import { AppError } from "@/utils/appError.js";
import { generateOrderCode } from "@/utils/generateOrderCode.js";

const ORDER_PAYMENT_HOLD_MINUTES = 30;

type ProductOptionValue = {
  code?: string;
  label?: string;
  colorHex?: string;
  isDefault?: boolean;
};
type ProductDelegateClient = Pick<Prisma.TransactionClient, "product">;

function parseOptionValues(values: unknown): ProductOptionValue[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.filter((value): value is ProductOptionValue => {
    return Boolean(value && typeof value === "object" && "code" in value);
  });
}

function getItemKey(item: CreateOrderItemDto) {
  const selectedOptions = [...(item.selectedOptions ?? [])].sort((first, second) =>
    first.optionType.localeCompare(second.optionType),
  );

  return `${item.productId}:${selectedOptions
    .map((option) => `${option.optionType}:${option.code}`)
    .join("|")}`;
}

function getProductQuantities(items: CreateOrderItemDto[]) {
  const productQuantities = new Map<string, number>();

  for (const item of items) {
    productQuantities.set(
      item.productId,
      (productQuantities.get(item.productId) ?? 0) + item.quantity,
    );
  }

  return productQuantities;
}

function groupItems(items: CreateOrderItemDto[]) {
  const groupedItems = new Map<string, CreateOrderItemDto>();

  for (const item of items) {
    const itemKey = getItemKey(item);
    const existedItem = groupedItems.get(itemKey);

    if (existedItem) {
      existedItem.quantity += item.quantity;
      continue;
    }

    groupedItems.set(itemKey, {
      ...item,
      selectedOptions: item.selectedOptions ?? [],
    });
  }

  return [...groupedItems.values()];
}

function buildExpiresAt() {
  return new Date(Date.now() + ORDER_PAYMENT_HOLD_MINUTES * 60 * 1000);
}

function normalizeOptionalText(value?: string) {
  return value && value.length > 0 ? value : null;
}

function normalizePhoneForLookup(value: string) {
  return value.replace(/\D/g, "");
}

function resolveSelectedOptions(
  item: CreateOrderItemDto,
  product: NonNullable<Awaited<ReturnType<typeof findProductsForOrder>>>[number],
) {
  const selectedOptions = item.selectedOptions ?? [];
  const resolvedOptions = [];

  for (const productOption of product.options) {
    const selectedOption = selectedOptions.find(
      (option) => option.optionType === productOption.optionType,
    );

    if (!selectedOption) {
      throw new AppError(
        `Vui lòng chọn ${productOption.name} cho sản phẩm ${product.name}.`,
        400,
        "PRODUCT_OPTION_REQUIRED",
      );
    }

    const matchedValue = parseOptionValues(productOption.values).find(
      (value) => value.code?.toUpperCase() === selectedOption.code,
    );

    if (!matchedValue?.code || !matchedValue.label) {
      throw new AppError(
        `Tùy chọn của sản phẩm ${product.name} không còn khả dụng.`,
        400,
        "PRODUCT_OPTION_INVALID",
      );
    }

    resolvedOptions.push({
      optionType: productOption.optionType,
      name: productOption.name,
      code: matchedValue.code,
      label: matchedValue.label,
      colorHex: matchedValue.colorHex,
    });
  }

  return resolvedOptions;
}

function buildOrderItem(
  item: CreateOrderItemDto,
  product: NonNullable<Awaited<ReturnType<typeof findProductsForOrder>>>[number],
) {
  const selectedOptions = resolveSelectedOptions(item, product);
  const thumbnail = product.images[0] ?? null;
  const unitPrice = product.salePrice ?? product.originalPrice;
  const totalPrice = unitPrice * item.quantity;

  return {
    productId: product.id,
    unitPrice,
    quantity: item.quantity,
    totalPrice,
    productSnapshot: {
      id: product.id,
      code: product.code,
      name: product.name,
      slug: product.slug,
      category: product.category,
      image: thumbnail?.url ?? null,
      imageAlt: thumbnail?.altText ?? null,
      originalPrice: product.originalPrice,
      salePrice: product.salePrice,
      price: unitPrice,
      selectedOptions,
    },
  };
}

function findProductsForOrder(
  productIds: string[],
  client: ProductDelegateClient = prisma,
) {
  return client.product.findMany({
    where: {
      id: { in: productIds },
    },
    select: {
      id: true,
      code: true,
      name: true,
      slug: true,
      originalPrice: true,
      salePrice: true,
      stockQuantity: true,
      status: true,
      deletedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        where: { isThumbnail: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        take: 1,
        select: {
          url: true,
          altText: true,
        },
      },
      options: {
        where: {
          optionType: {
            in: [ProductOptionType.COLOR, ProductOptionType.SIZE],
          },
        },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        select: {
          optionType: true,
          name: true,
          values: true,
        },
      },
    },
  });
}

export const orderService = {
  async listOrders(customerId: string, query: ListOrdersQueryDto) {
    const where: Prisma.OrderWhereInput = {
      customerId,
      ...(query.status ? { orderStatus: query.status } : {}),
    };

    return prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderCode: true,
        totalAmount: true,
        paymentStatus: true,
        orderStatus: true,
        expiresAt: true,
        createdAt: true,
        items: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            productId: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            productSnapshot: true,
          },
        },
      },
    });
  },

  async createOrder(customerId: string, payload: CreateOrderRequestDto) {
    const items = groupItems(payload.items);
    const productIds = [...new Set(items.map((item) => item.productId))];
    const productQuantities = getProductQuantities(items);

    return prisma.$transaction(
      async (tx) => {
        const [customer, products] = await Promise.all([
          tx.customer.findUnique({
            where: { id: customerId },
            select: { id: true, email: true },
          }),
          findProductsForOrder(productIds, tx),
        ]);
        const productById = new Map(products.map((product) => [product.id, product]));

        if (!customer) {
          throw new AppError(
            "Bạn cần đăng nhập để tiếp tục.",
            401,
            "UNAUTHORIZED",
          );
        }

        for (const item of items) {
          const product = productById.get(item.productId);

          if (!product) {
            throw new AppError(
              "Sản phẩm trong giỏ hàng không tồn tại.",
              400,
              "PRODUCT_NOT_FOUND",
            );
          }

          if (product.status !== ProductStatus.ACTIVE || product.deletedAt !== null) {
            throw new AppError(
              `Sản phẩm ${product.name} không còn khả dụng.`,
              400,
              "PRODUCT_UNAVAILABLE",
            );
          }
        }

        for (const [productId, quantity] of productQuantities) {
          const product = productById.get(productId);

          if (!product || product.stockQuantity < quantity) {
            throw new AppError(
              `Sản phẩm ${product?.name ?? ""} không đủ số lượng tồn kho.`,
              400,
              "PRODUCT_OUT_OF_STOCK",
            );
          }
        }

        const orderItems = items.map((item) => {
          const product = productById.get(item.productId);

          if (!product) {
            throw new AppError(
              "Sản phẩm trong giỏ hàng không tồn tại.",
              400,
              "PRODUCT_NOT_FOUND",
            );
          }

          return buildOrderItem(item, product);
        });
        const subtotal = orderItems.reduce(
          (total, item) => total + item.totalPrice,
          0,
        );
        const shippingFee = payload.shippingFee;
        const discountAmount = 0;
        const pointsDiscount = 0;
        const totalAmount = subtotal + shippingFee - discountAmount - pointsDiscount;
        const orderCode = generateOrderCode();
        const expiresAt = buildExpiresAt();

        for (const [productId, quantity] of productQuantities) {
          const updateResult = await tx.product.updateMany({
            where: {
              id: productId,
              stockQuantity: { gte: quantity },
              status: ProductStatus.ACTIVE,
              deletedAt: null,
            },
            data: {
              stockQuantity: { decrement: quantity },
            },
          });

          if (updateResult.count !== 1) {
            throw new AppError(
              "Một số sản phẩm vừa hết hàng. Vui lòng kiểm tra lại giỏ hàng.",
              400,
              "PRODUCT_OUT_OF_STOCK",
            );
          }
        }

        const order = await tx.order.create({
          data: {
            orderCode,
            customerId,
            customerName: payload.customerName,
            customerPhone: payload.customerPhone,
            customerEmail: payload.customerEmail ?? customer.email,
            shippingAddress: payload.shippingAddress,
            shippingProvince: normalizeOptionalText(payload.shippingProvince),
            shippingDistrict: normalizeOptionalText(payload.shippingDistrict),
            shippingWard: normalizeOptionalText(payload.shippingWard),
            customerNote: normalizeOptionalText(payload.customerNote),
            subtotal,
            shippingFee,
            discountAmount,
            pointsDiscount,
            totalAmount,
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            paymentStatus: PaymentStatus.PENDING,
            orderStatus: OrderStatus.PENDING_PAYMENT,
            expiresAt,
            items: {
              create: orderItems.map((item) => ({
                productId: item.productId,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                productSnapshot: item.productSnapshot as Prisma.InputJsonValue,
              })),
            },
            payments: {
              create: {
                provider: PaymentProvider.VIETQR,
                method: PaymentMethod.BANK_TRANSFER,
                bankName: env.BANK_CODE ?? "BANK_TRANSFER",
                bankBin: env.BANK_CODE ?? "BANK_TRANSFER",
                accountNo: env.BANK_ACCOUNT_NUMBER ?? "",
                accountName: env.BANK_ACCOUNT_NAME ?? "",
                amount: totalAmount,
                transferContent: orderCode,
                isMatched: false,
                status: PaymentStatus.PENDING,
              },
            },
          },
          select: {
            id: true,
            orderCode: true,
            subtotal: true,
            shippingFee: true,
            discountAmount: true,
            pointsDiscount: true,
            totalAmount: true,
            paymentMethod: true,
            paymentStatus: true,
            orderStatus: true,
            expiresAt: true,
            items: {
              select: {
                id: true,
                productId: true,
                unitPrice: true,
                quantity: true,
                totalPrice: true,
                productSnapshot: true,
              },
            },
            payments: {
              take: 1,
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                provider: true,
                method: true,
                bankName: true,
                bankBin: true,
                accountNo: true,
                accountName: true,
                amount: true,
                transferContent: true,
                status: true,
              },
            },
          },
        });

        return order;
      },
      {
        timeout: 15000,
      },
    );
  },

  async lookupOrder(payload: LookupOrderRequestDto) {
    const order = await prisma.order.findUnique({
      where: {
        orderCode: payload.orderCode,
      },
      select: {
        id: true,
        orderCode: true,
        customerName: true,
        customerPhone: true,
        customerEmail: true,
        shippingAddress: true,
        shippingProvince: true,
        shippingDistrict: true,
        shippingWard: true,
        customerNote: true,
        subtotal: true,
        shippingFee: true,
        discountAmount: true,
        pointsDiscount: true,
        totalAmount: true,
        paymentMethod: true,
        paymentStatus: true,
        orderStatus: true,
        expiresAt: true,
        paidAt: true,
        cancelledAt: true,
        cancelReason: true,
        shippingUnit: true,
        trackingCode: true,
        createdAt: true,
        updatedAt: true,
        items: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            productId: true,
            unitPrice: true,
            quantity: true,
            totalPrice: true,
            productSnapshot: true,
            createdAt: true,
          },
        },
      },
    });

    const requestPhone = normalizePhoneForLookup(payload.customerPhone);
    const orderPhone = order
      ? normalizePhoneForLookup(order.customerPhone)
      : "";

    if (!order || requestPhone !== orderPhone) {
      throw new AppError(MESSAGES.ORDER_NOT_FOUND, 404, "ORDER_NOT_FOUND");
    }

    return order;
  },

  async getOrderDetail(customerId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      select: {
        id: true,
        orderCode: true,
        customerName: true,
        customerPhone: true,
        customerEmail: true,
        shippingAddress: true,
        shippingProvince: true,
        shippingDistrict: true,
        shippingWard: true,
        customerNote: true,
        subtotal: true,
        shippingFee: true,
        discountAmount: true,
        pointsDiscount: true,
        totalAmount: true,
        paymentMethod: true,
        paymentStatus: true,
        orderStatus: true,
        expiresAt: true,
        paidAt: true,
        cancelledAt: true,
        cancelReason: true,
        shippingUnit: true,
        trackingCode: true,
        createdAt: true,
        updatedAt: true,
        items: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            productId: true,
            unitPrice: true,
            quantity: true,
            totalPrice: true,
            productSnapshot: true,
            createdAt: true,
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            provider: true,
            method: true,
            bankName: true,
            bankBin: true,
            accountNo: true,
            accountName: true,
            amount: true,
            transferContent: true,
            qrImageUrl: true,
            transactionRef: true,
            isMatched: true,
            status: true,
            paidAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Không tìm thấy đơn hàng.", 404, "ORDER_NOT_FOUND");
    }

    return order;
  },
};
