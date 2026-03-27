import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";
import { env } from "../env.ts";

export const DATABASE_URL = `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;

const client = postgres(DATABASE_URL);

export const db = drizzle(client, { schema });
