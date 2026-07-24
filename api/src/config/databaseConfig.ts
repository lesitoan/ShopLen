import { env } from "@/config/envValidation.js";

export const databaseConfig = {
  url: env.DATABASE_URL,
};
