import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema.js";

const client = postgres(
  "postgresql://postgres:MyS3cureP%40ss@localhost:5432/itareport_test",
);

export const testDb = drizzle(client, { schema });
