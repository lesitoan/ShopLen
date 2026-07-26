import { createClient } from "redis";
import { env } from "@/config/envValidation.js";
import { AppError } from "@/utils/appError.js";

const globalForRedis = globalThis as unknown as {
  redisClient?: ReturnType<typeof createClient>;
};

export const redisClient =
  globalForRedis.redisClient ??
  createClient({
    url: env.REDIS_URL,
  });

redisClient.on("error", (error) => {
  console.error("Redis client error", error);
});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redisClient;
}

export async function getRedisClient() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    } catch (error) {
      throw new AppError(
        "Không thể kết nối Redis.",
        500,
        "REDIS_CONNECTION_FAILED",
        error instanceof Error ? error.message : "Unknown Redis connection error.",
      );
    }
  }

  return redisClient;
}
