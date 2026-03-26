import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";
import { env } from "../env.ts";

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });
