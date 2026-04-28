import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const TEST_DB = "itareport_test";

function buildDsn() {
  const user = process.env.POSTGRES_USER ?? "postgres";
  const password = process.env.POSTGRES_PASSWORD;
  const host = process.env.POSTGRES_HOST ?? "localhost";
  const port = process.env.POSTGRES_PORT ?? "5432";
  if (!password) throw new Error("POSTGRES_PASSWORD is required for test setup");
  return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${TEST_DB}`;
}

export async function setup() {
  const client = postgres(buildDsn(), { max: 1 });
  const db = drizzle(client);
  await migrate(db, {
    migrationsFolder: resolve(__dirname, "../../drizzle"),
  });
  await client.end();
}

export async function teardown() {
  const { client } = await import("./db.js");
  await client.end({ timeout: 5 });
}
