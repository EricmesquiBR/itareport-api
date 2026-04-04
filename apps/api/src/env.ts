import * as dotenv from "dotenv";

import { z } from "zod";

dotenv.config();

const envShape = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().positive().default(3000),
  HOST: z.string().default("0.0.0.0"),
  POSTGRES_HOST: z.string().optional(),
  POSTGRES_USER: z.string().default("postgres").optional(),
  POSTGRES_PASSWORD: z.string().min(1, "POSTGRES_PASSWORD is required"),
  POSTGRES_DB: z.string().optional(),
  POSTGRES_PORT: z.coerce.number().positive().default(5432).optional(),
  REDIS_PORT: z.coerce.number().positive().default(6379).optional(),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info")
    .optional(),
  CORS_ORIGIN: z.string().default("*"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

const safeEnv = envShape.safeParse(process.env);

if (!safeEnv.success) {
  console.error("Invalid environment variables:", safeEnv.error);
  process.exit(1);
}

export const env = safeEnv.data;
