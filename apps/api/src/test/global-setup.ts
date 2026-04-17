import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function setup() {
  const client = postgres(
    "postgresql://postgres:MyS3cureP%40ss@localhost:5432/itareport_test",
    { max: 1 },
  );
  const db = drizzle(client);
  await migrate(db, {
    migrationsFolder: resolve(__dirname, "../../drizzle"),
  });
  await client.end();
}
