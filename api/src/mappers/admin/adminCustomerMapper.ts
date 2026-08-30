import type {
  AdminCustomerDetail,
  AdminCustomerDetailRecord,
  AdminCustomerListItem,
  AdminCustomerRecord,
} from "@/types/adminCustomer.type.js";

function toIsoString(date: Date | null) {
  return date ? date.toISOString() : null;
}

export function toAdminCustomerListItem(
  customer: AdminCustomerRecord,
): AdminCustomerListItem {
  return {
    id: customer.id,
    code: customer.code,
    fullName: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    gender: customer.gender,
    birthday: customer.birthday?.toISOString().slice(0, 10) ?? null,
    avatar: customer.avatar,
    status: customer.status,
    emailVerified: customer.emailVerified,
    isManualLogin: customer.isManualLogin,
    isGoogleLogin: customer.isGoogleLogin,
    lastLoginAt: toIsoString(customer.lastLoginAt),
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}

export function toAdminCustomerDetail(
  customer: AdminCustomerDetailRecord,
): AdminCustomerDetail {
  return {
    ...toAdminCustomerListItem(customer),
    orders: customer.orders.map((order) => ({
      id: order.id,
      orderCode: order.orderCode,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt.toISOString(),
      itemsCount: order._count.items,
    })),
  };
}
