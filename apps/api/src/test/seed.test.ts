import { beforeEach, describe, expect, it } from "vitest";
import { testDb } from "./db.js";
import { categories } from "../db/schema.js";
import { seedCategories, CATEGORIES } from "../db/seed.js";

describe("seedCategories", () => {
  beforeEach(async () => {
    await testDb.delete(categories);
  });

  it("inserts all categories into an empty table", async () => {
    await seedCategories(testDb);
    const rows = await testDb.select().from(categories);
    expect(rows).toHaveLength(CATEGORIES.length);
  });

  it("is idempotent — running twice yields the same rows", async () => {
    await seedCategories(testDb);
    await seedCategories(testDb);
    const rows = await testDb.select().from(categories);
    expect(rows).toHaveLength(CATEGORIES.length);
  });

  it("all slugs are unique and non-empty", async () => {
    await seedCategories(testDb);
    const rows = await testDb.select().from(categories);
    const slugs = rows.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(CATEGORIES.length);
    slugs.forEach((s) => expect(s.length).toBeGreaterThan(0));
  });
});
