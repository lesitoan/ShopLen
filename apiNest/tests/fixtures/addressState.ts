import { randomUUID } from "node:crypto";
import type { CustomerAddress } from "@prisma/client";

export function createAddressState() {
  const addresses = new Map<string, CustomerAddress>();
  const matches = (item: CustomerAddress, where: Partial<CustomerAddress>) =>
    Object.entries(where).every(([key, value]) => Reflect.get(item, key) === value);
  const customerAddress = {
    count: async ({ where }: { where: Partial<CustomerAddress> }) => [...addresses.values()].filter((item) => matches(item, where)).length,
    findFirst: async ({ where }: { where: Partial<CustomerAddress> }) => [...addresses.values()].find((item) => matches(item, where)) ?? null,
    findMany: async ({ where, select }: { where: Partial<CustomerAddress>; select: Record<string, boolean> }) =>
      [...addresses.values()].filter((item) => matches(item, where))
        .sort((left, right) => Number(right.isDefault) - Number(left.isDefault) || right.createdAt.getTime() - left.createdAt.getTime())
        .map((item) => Object.fromEntries(Object.keys(select).map((key) => [key, Reflect.get(item, key)]))),
    create: async ({ data }: { data: Omit<CustomerAddress, "id" | "createdAt" | "updatedAt" | "districtName" | "wardName"> & Partial<CustomerAddress> }) => {
      const item: CustomerAddress = { ...data, districtName: data.districtName ?? null, wardName: data.wardName ?? null, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
      addresses.set(item.id, item);
      return item;
    },
    updateMany: async ({ where, data }: { where: Partial<CustomerAddress>; data: Partial<CustomerAddress> }) => {
      for (const item of addresses.values()) if (matches(item, where)) Object.assign(item, data);
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<CustomerAddress> }) => {
      const item = addresses.get(where.id);
      if (!item) throw new Error("missing address");
      Object.assign(item, data);
      return item;
    },
    delete: async ({ where }: { where: { id: string } }) => { addresses.delete(where.id); },
  };
  return {
    addresses,
    prisma: {
      customerAddress,
      $transaction: async <T>(callback: (transaction: { customerAddress: typeof customerAddress }) => Promise<T>) => callback({ customerAddress }),
    },
  };
}
