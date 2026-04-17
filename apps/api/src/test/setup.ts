import { afterEach } from "vitest";
import { testDb } from "./db.js";
import { reportImages, reportVotes, reports, users, categories } from "../db/schema.js";

afterEach(async () => {
  await testDb.delete(reportVotes);
  await testDb.delete(reportImages);
  await testDb.delete(reports);
  await testDb.delete(users);
  await testDb.delete(categories);
});
