import { createAuthState } from "./authState.js";
import { createAddressState } from "./addressState.js";
import { attachUserState } from "./userState.js";

export async function createAccountParityState() {
  const state = await createAuthState();
  attachUserState(state);
  const addressState = createAddressState();
  const instant = new Date("2026-01-01T00:00:00.000Z");
  let sequence = 10;
  const nextId = () => `00000000-0000-4000-8000-${String(sequence++).padStart(12, "0")}`;
  const createAddress = addressState.prisma.customerAddress.create;
  addressState.prisma.customerAddress.create = async (query) => {
    const item = await createAddress(query);
    addressState.addresses.delete(item.id);
    Object.assign(item, { id: nextId(), createdAt: instant, updatedAt: instant });
    addressState.addresses.set(item.id, item);
    return item;
  };
  Object.assign(state.prisma, {
    customerAddress: addressState.prisma.customerAddress,
    $transaction: async <T>(query: Array<Promise<T>> | ((transaction: unknown) => Promise<T>)) =>
      typeof query === "function" ? query(state.prisma) : Promise.all(query),
  });
  const findCustomer = state.prisma.customer.findUnique;
  Object.assign(state.prisma.customer, {
    findMany: async () => [...state.customers.values()],
    count: async () => state.customers.size,
    findUnique: async (query: Parameters<typeof findCustomer>[0]) => {
      const customer = await findCustomer(query);
      return customer ? { ...customer, orders: [] } : null;
    },
  });
  Object.assign(state.prisma.user, {
    create: async ({ data }: { data: Partial<typeof state.user> }) => {
      const item = { ...state.user, ...data, id: nextId(), phone: data.phone ?? null, avatar: data.avatar ?? null, lastLoginAt: null };
      state.users.set(item.id, item);
      return item;
    },
  });
  return { ...state, addresses: addressState.addresses };
}
