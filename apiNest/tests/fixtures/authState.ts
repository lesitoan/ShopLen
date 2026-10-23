import type { Customer, User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { hashPassword } from "@/modules/auth/security/hashPassword.js";
import { MemoryRedis } from "../harness/memoryRedis.js";

export async function createAuthState() {
  const passwordHash = await hashPassword("original-password");
  const now = new Date("2026-01-01T00:00:00.000Z");
  const customer: Customer = {
    id: "00000000-0000-4000-8000-000000000001", code: "CUS_TEST", fullName: "Khách kiểm thử",
    email: "customer@test.local", passwordHash, emailVerified: false, isManualLogin: true, isGoogleLogin: false,
    googleAccountId: null, phone: null, gender: null, birthday: null, avatar: null, status: "ACTIVE",
    rewardPoints: 0, totalSpent: 0, totalOrders: 0, lastLoginAt: null, createdAt: now, updatedAt: now,
  };
  const user: User = {
    id: "00000000-0000-4000-8000-000000000002", code: "USR_TEST", fullName: "Quản trị kiểm thử",
    email: "admin@test.local", passwordHash, phone: null, avatar: null, role: "ADMIN", status: "ACTIVE",
    lastLoginAt: null, createdAt: now, updatedAt: now,
  };
  const customers = new Map([[customer.id, customer]]);
  const users = new Map([[user.id, user]]);
  const notifications: Array<{ name: string; data: unknown }> = [];
  const emails: Array<{ to: string; otpCode: string; expiresInMinutes: number }> = [];
  let sequence = 3;
  const matches = (item: Customer, where: { id?: string; email?: string; googleAccountId?: string }) =>
    Object.entries(where).every(([key, value]) => Reflect.get(item, key) === value);
  return {
    customer, user, customers, users, notifications, emails, redis: new MemoryRedis(),
    prisma: {
      customer: {
        findUnique: async ({ where }: { where: { id?: string; email?: string } }) =>
          [...customers.values()].find((item) => matches(item, where)) ?? null,
        findFirst: async ({ where }: { where: { OR: Array<{ email?: string; googleAccountId?: string }> } }) =>
          [...customers.values()].find((item) => where.OR.some((part) => matches(item, part))) ?? null,
        create: async ({ data }: { data: Partial<Customer> }) => {
          if ([...customers.values()].some((item) => item.email === data.email)) {
            throw new Prisma.PrismaClientKnownRequestError("duplicate email", { code: "P2002", clientVersion: "7.9.0" });
          }
          const item = { ...customer, ...data, id: `00000000-0000-4000-8000-${String(sequence++).padStart(12, "0")}` };
          customers.set(item.id, item);
          return item;
        },
        update: async ({ where, data }: { where: { id: string }; data: Partial<Customer> }) => {
          const item = customers.get(where.id);
          if (!item) throw new Error("missing customer");
          Object.assign(item, data);
          return item;
        },
      },
      user: {
        findUnique: async ({ where }: { where: { id?: string; email?: string } }) =>
          [...users.values()].find((item) => Object.entries(where).every(([key, value]) => Reflect.get(item, key) === value)) ?? null,
        update: async ({ where, data }: { where: { id: string }; data: Partial<User> }) => {
          const item = users.get(where.id);
          if (!item) throw new Error("missing user");
          Object.assign(item, data);
          return item;
        },
      },
    },
  };
}

export type AuthState = Awaited<ReturnType<typeof createAuthState>>;
