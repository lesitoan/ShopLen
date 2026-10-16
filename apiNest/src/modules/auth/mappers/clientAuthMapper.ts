import type { Customer } from "@prisma/client";
import type { CustomerSession } from "@/modules/auth/types/clientAuth.type.js";
export function toCustomerSession(customer: Customer): CustomerSession {
    return {
        id: customer.id,
        code: customer.code,
        fullName: customer.fullName,
        email: customer.email,
        emailVerified: customer.emailVerified,
        phone: customer.phone,
        gender: customer.gender,
        birthday: customer.birthday?.toISOString().slice(0, 10) ?? null,
        avatar: customer.avatar,
        status: customer.status,
        isManualLogin: customer.isManualLogin,
        isGoogleLogin: customer.isGoogleLogin,
        rewardPoints: customer.rewardPoints,
        totalSpent: customer.totalSpent,
        totalOrders: customer.totalOrders,
    };
}
