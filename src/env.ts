import * as dotenv from "dotenv";

import { z } from "zod";

dotenv.config();

const envShape = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().positive().default(3000),
  HOST: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_USER: z.string().default("postgres"),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.coerce.number().positive().default(5432),
  REDIS_PORT: z.coerce.number().positive().default(6379),
});

const safeEnv = envShape.safeParse(process.env);

if (!safeEnv.success) {
  console.error("Invalid environment variables:", safeEnv.error);
  process.exit(1);
}

export const env = safeEnv.data;
