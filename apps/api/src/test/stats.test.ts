import { describe, expect, it } from "vitest";
import { app } from "../app.js";
import { testDb } from "./db.js";
import { categories, reports, users } from "../db/schema.js";

type StatsBody = { success: boolean; data: Record<string, number> };

describe("GET /v1/stats", () => {
  it("returns stats with zeros on empty DB", async () => {
    const res = await app.request("/v1/stats");
    expect(res.status).toBe(200);
    const body = (await res.json()) as StatsBody;
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({
      totalReports: 0,
      activeReports: 0,
      pendingReports: 0,
      expiredReports: 0,
      totalUsers: 0,
      totalVotes: 0,
    });
  });

  it("reflects seeded reports and users", async () => {
    const [cat] = await testDb
      .insert(categories)
      .values({ name: "Buracos", slug: "buracos" })
      .onConflictDoNothing({ target: categories.slug })
      .returning();
    const [user] = await testDb
      .insert(users)
      .values({ email: "stats@test.com" })
      .returning();

    await testDb.insert(reports).values([
      {
        title: "Buraco na rua",
        lat: -3.9200,
        lng: -39.5500,
        userId: user!.id,
        categoryId: cat!.id,
        status: "active",
        expiresAt: new Date(Date.now() + 86400000),
      },
      {
        title: "Poste apagado",
        lat: -3.9210,
        lng: -39.5510,
        userId: user!.id,
        categoryId: cat!.id,
        status: "pending",
        expiresAt: new Date(Date.now() + 86400000),
      },
    ]);

    const res = await app.request("/v1/stats");
    const body = (await res.json()) as StatsBody;
    expect(body.data.totalReports).toBe(2);
    expect(body.data.activeReports).toBe(1);
    expect(body.data.pendingReports).toBe(1);
    expect(body.data.totalUsers).toBe(1);
  });
});
