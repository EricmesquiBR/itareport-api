import { describe, expect, it } from "vitest";
import { eq, isNull } from "drizzle-orm";
import { testDb } from "./db.js";
import { users } from "../db/schema.js";

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
