import { describe, expect, it } from "vitest";
import { app } from "../app.js";
import { testDb } from "./db.js";
import { categories, reports, users } from "../db/schema.js";

async function signUp(email: string, password: string) {
  return app.request("/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name: "Test User" }),
  });
}

async function signIn(email: string, password: string) {
  const res = await app.request("/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const cookie = res.headers.get("set-cookie") ?? "";
  return { res, cookie };
}

async function createSession(email: string, password: string) {
  await signUp(email, password);
  return signIn(email, password);
}

async function seedUser(email: string) {
  const result = await testDb.insert(users).values({ email }).returning();
  return result[0]!;
}

async function seedCategory() {
  const result = await testDb
    .insert(categories)
    .values({ name: "Buracos e Pavimentação", slug: "buracos-e-pavimentacao" })
    .onConflictDoNothing({ target: categories.slug })
    .returning();
  if (result[0]) return result[0];
  const existing = await testDb.select().from(categories).limit(1);
  return existing[0]!;
}

async function seedReport(opts: {
  userId: string;
  categoryId: string;
  status?: "pending" | "active";
}) {
  const result = await testDb
    .insert(reports)
    .values({
      title: "Test report",
      lat: -3.925,
      lng: -39.55,
      status: opts.status ?? "active",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: opts.userId,
      categoryId: opts.categoryId,
    })
    .returning();
  return result[0]!;
}

describe("POST /v1/reports/:id/vote", () => {
  it("returns 401 without auth", async () => {
    const owner = await seedUser("vote-anon-owner@test.com");
    const cat = await seedCategory();
    const report = await seedReport({ userId: owner.id, categoryId: cat.id });

    const res = await app.request(`/v1/reports/${report.id}/vote`, { method: "POST" });
    expect(res.status).toBe(401);
  });

  it("returns 409 on duplicate vote", async () => {
    const cat = await seedCategory();
    const owner = await seedUser("dup-owner@test.com");
    const report = await seedReport({ userId: owner.id, categoryId: cat.id });
    const { cookie } = await createSession("vote-dup@test.com", "password123456");

    await app.request(`/v1/reports/${report.id}/vote`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    const res = await app.request(`/v1/reports/${report.id}/vote`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(409);
  });

  it("increments upvotes and recalculates credibility", async () => {
    const cat = await seedCategory();
    const owner = await seedUser("cred-owner@test.com");
    const report = await seedReport({ userId: owner.id, categoryId: cat.id, status: "pending" });
    const { cookie } = await createSession("cred-voter@test.com", "password123456");

    const res = await app.request(`/v1/reports/${report.id}/vote`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(true);

    const reportRes = await app.request(`/v1/reports/${report.id}`);
    const reportBody = (await reportRes.json()) as Record<string, unknown>;
    const data = reportBody.data as Record<string, unknown>;
    expect(data.upvotes).toBe(1);
    expect(data.credibility as number).toBeGreaterThan(0);
  });

  it("promotes pending report to active when credibility reaches 30", async () => {
    const cat = await seedCategory();
    const owner = await seedUser("promo-owner@test.com");
    const report = await seedReport({ userId: owner.id, categoryId: cat.id, status: "pending" });

    // 2 unique voters on day 0: 2*10 + 2*5 = 30 >= 30 → active
    const { cookie: c1 } = await createSession("promo-v1@test.com", "password123456");
    const { cookie: c2 } = await createSession("promo-v2@test.com", "password123456");

    await app.request(`/v1/reports/${report.id}/vote`, { method: "POST", headers: { Cookie: c1 } });
    await app.request(`/v1/reports/${report.id}/vote`, { method: "POST", headers: { Cookie: c2 } });

    const reportRes = await app.request(`/v1/reports/${report.id}`);
    const reportBody = (await reportRes.json()) as Record<string, unknown>;
    const data = reportBody.data as Record<string, unknown>;
    expect(data.status).toBe("active");
  });
});

describe("GET /v1/reports/:id/votes", () => {
  it("returns upvote count without exposing userId", async () => {
    const cat = await seedCategory();
    const owner = await seedUser("vcount-owner@test.com");
    const report = await seedReport({ userId: owner.id, categoryId: cat.id });
    const { cookie } = await createSession("vcount-voter@test.com", "password123456");

    await app.request(`/v1/reports/${report.id}/vote`, {
      method: "POST",
      headers: { Cookie: cookie },
    });

    const res = await app.request(`/v1/reports/${report.id}/votes`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(true);
    const data = body.data as Record<string, unknown>;
    expect(data.upvotes).toBe(1);
    expect(data.userId).toBeUndefined();
  });
});
