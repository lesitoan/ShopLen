import { env } from "@/config/envValidation.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prismaLogLevels: Prisma.LogLevel[] = env.PRISMA_LOG_QUERIES
  ? ["query", "error", "warn"]
  : ["error", "warn"];

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: prismaLogLevels,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
