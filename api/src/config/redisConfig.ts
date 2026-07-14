import { env } from "./envValidation.js";

export const redisConfig = {
  url: env.REDIS_URL,
};
