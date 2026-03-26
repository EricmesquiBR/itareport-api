import * as dotenv from "dotenv";

import { z } from "zod";

dotenv.config();

const envShape = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.url().startsWith("postgresql://"),
});

const safeEnv = envShape.safeParse(process.env);

if (!safeEnv.success) {
  console.error("Invalid environment variables:", safeEnv.error);
  process.exit(1);
}

export const env = safeEnv.data;
