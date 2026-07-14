import { env } from "./envValidation.js";

export const databaseConfig = {
  url: env.DATABASE_URL,
};
