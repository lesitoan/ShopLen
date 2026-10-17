import { randomUUID } from "node:crypto";
import { Prisma, type User } from "@prisma/client";
import type { AuthState } from "./authState.js";

export function attachUserState(state: AuthState) {
  const inUse = new Set<string>();
  const queries: Array<Record<string, unknown>> = [];
  const unique = (data: Partial<User>, id?: string) => {
    if ([...state.users.values()].some((user) => user.id !== id && ["email", "phone", "code"].some((field) =>
      Reflect.get(data, field) != null && Reflect.get(data, field) === Reflect.get(user, field)))) {
      throw new Prisma.PrismaClientKnownRequestError("duplicate user", { code: "P2002", clientVersion: "7.9.0" });
    }
  };
  const update = state.prisma.user.update;
  Object.assign(state.prisma.user, {
    findMany: async (query: Record<string, unknown>) => { queries.push(query); return [...state.users.values()]; },
    count: async () => state.users.size,
    create: async ({ data }: { data: Partial<User> }) => {
      unique(data);
      const user: User = { ...state.user, ...data, id: randomUUID(), phone: data.phone ?? null, avatar: data.avatar ?? null, lastLoginAt: null };
      state.users.set(user.id, user);
      return user;
    },
    update: async (query: Parameters<typeof update>[0]) => { unique(query.data, query.where.id); return update(query); },
    delete: async ({ where }: { where: { id: string } }) => {
      if (inUse.has(where.id)) throw new Prisma.PrismaClientKnownRequestError("user in use", { code: "P2003", clientVersion: "7.9.0" });
      state.users.delete(where.id);
      return { id: where.id };
    },
  });
  Object.assign(state.prisma, { $transaction: async (queries: Array<Promise<unknown>>) => Promise.all(queries) });
  return { inUse, queries };
}
