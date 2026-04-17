import { afterEach } from "vitest";
import { testDb } from "./db.js";
import { reports, users, categories } from "../db/schema.js";

afterEach(async () => {
  await testDb.delete(reports);
  await testDb.delete(users);
  await testDb.delete(categories);
});
