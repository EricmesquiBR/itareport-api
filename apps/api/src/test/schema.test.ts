import { describe, expect, it } from "vitest";
import { eq, isNull } from "drizzle-orm";
import { testDb } from "./db.js";
import { categories, reports, users } from "../db/schema.js";

describe("users schema", () => {
  it("auto-generates username when only email is provided", async () => {
    const [user] = await testDb
      .insert(users)
      .values({ email: "civic@test.com" })
      .returning();

    expect(user.username).toMatch(/^[a-z]+-[a-z]+-\d{1,4}$/);
  });

  it("deleted_at is null by default on fresh insert", async () => {
    const [user] = await testDb
      .insert(users)
      .values({ email: "fresh@test.com" })
      .returning();

    expect(user.deletedAt).toBeNull();
  });

  it("soft delete sets deleted_at without removing the row", async () => {
    const [created] = await testDb
      .insert(users)
      .values({ email: "ghost@test.com" })
      .returning();

    await testDb
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, created.id));

    const [found] = await testDb
      .select()
      .from(users)
      .where(eq(users.id, created.id));

    expect(found).toBeDefined();
    expect(found.deletedAt).not.toBeNull();
  });

  it("soft-deleted users are excluded by IS NULL filter", async () => {
    const [active] = await testDb
      .insert(users)
      .values({ email: "active@test.com" })
      .returning();

    const [deleted] = await testDb
      .insert(users)
      .values({ email: "deleted@test.com" })
      .returning();

    await testDb
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, deleted.id));

    const visible = await testDb
      .select()
      .from(users)
      .where(isNull(users.deletedAt));

    const ids = visible.map((u) => u.id);
    expect(ids).toContain(active.id);
    expect(ids).not.toContain(deleted.id);
  });
});

describe("reports schema", () => {
  async function seedUserAndCategory() {
    const [user] = await testDb
      .insert(users)
      .values({ email: "reporter@test.com" })
      .returning();

    const [category] = await testDb
      .insert(categories)
      .values({ name: "Buraco", slug: "buraco" })
      .returning();

    return { user, category };
  }

  it("defaults to pending status and zero counters on insert", async () => {
    const { user, category } = await seedUserAndCategory();

    const [report] = await testDb
      .insert(reports)
      .values({
        title: "Buraco na Rua Principal",
        lat: -3.9,
        lng: -39.5,
        userId: user.id,
        categoryId: category.id,
      })
      .returning();

    expect(report.status).toBe("pending");
    expect(report.credibility).toBe(0);
    expect(report.upvotes).toBe(0);
    expect(report.uniqueUpvoters).toBe(0);
    expect(report.photoCount).toBe(0);
  });

  it("expires_at is null by default — set by service layer", async () => {
    const { user, category } = await seedUserAndCategory();

    const [report] = await testDb
      .insert(reports)
      .values({
        title: "Lixo no canteiro",
        lat: -3.91,
        lng: -39.51,
        userId: user.id,
        categoryId: category.id,
      })
      .returning();

    expect(report.expiresAt).toBeNull();
  });

  it("preserves report when its author is soft-deleted (user row still exists)", async () => {
    const { user, category } = await seedUserAndCategory();

    const [report] = await testDb
      .insert(reports)
      .values({
        title: "Calçada quebrada",
        lat: -3.92,
        lng: -39.52,
        userId: user.id,
        categoryId: category.id,
      })
      .returning();

    await testDb
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, user.id));

    const [found] = await testDb
      .select()
      .from(reports)
      .where(eq(reports.id, report.id));

    expect(found).toBeDefined();
    expect(found.id).toBe(report.id);
  });

  it("sets user_id to null when author is hard-deleted (ON DELETE SET NULL)", async () => {
    const { user, category } = await seedUserAndCategory();

    const [report] = await testDb
      .insert(reports)
      .values({
        title: "Poste apagado",
        lat: -3.93,
        lng: -39.53,
        userId: user.id,
        categoryId: category.id,
      })
      .returning();

    await testDb.delete(users).where(eq(users.id, user.id));

    const [found] = await testDb
      .select()
      .from(reports)
      .where(eq(reports.id, report.id));

    expect(found).toBeDefined();
    expect(found.userId).toBeNull();
  });

  it("accepts report with null user_id (anonymous report)", async () => {
    const { category } = await seedUserAndCategory();

    const [report] = await testDb
      .insert(reports)
      .values({
        title: "Esgoto transbordando",
        lat: -3.94,
        lng: -39.54,
        userId: null,
        categoryId: category.id,
      })
      .returning();

    expect(report).toBeDefined();
    expect(report.userId).toBeNull();
  });
});
