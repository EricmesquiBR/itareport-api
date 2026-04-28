import { describe, expect, it, vi } from "vitest";
import { app } from "../app.js";
import { testDb } from "./db.js";
import { categories, reports, users } from "../db/schema.js";

vi.mock("../lib/storage.js", () => ({
  uploadImage: vi.fn().mockResolvedValue("reports/2026-04-17/rep_xxx/primary.webp"),
}));

vi.mock("../lib/image.js", () => ({
  processImage: vi.fn().mockResolvedValue({
    original: Buffer.from("fake-image-original"),
    thumbnail: Buffer.from("fake-image-thumb"),
  }),
}));

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

async function seedUser(email: string) {
  const result = await testDb.insert(users).values({ email }).returning();
  return result[0]!;
}

// Inside Centro de Itapajé bbox
const VALID_LAT = -3.925;
const VALID_LNG = -39.55;

// Outside bbox
const OUTSIDE_LAT = -4.5;
const OUTSIDE_LNG = -38.0;

function makeReportForm(opts: {
  lat?: number;
  lng?: number;
  catId: string;
  withImage?: boolean;
}): FormData {
  const form = new FormData();
  form.append("title", "Buraco na rua principal");
  form.append("lat", String(opts.lat ?? VALID_LAT));
  form.append("lng", String(opts.lng ?? VALID_LNG));
  form.append("categoryId", opts.catId);
  if (opts.withImage !== false) {
    const blob = new Blob([Buffer.from("fake-jpeg-data")], { type: "image/jpeg" });
    form.append("image", blob, "photo.jpg");
  }
  return form;
}

describe("POST /v1/reports", () => {
  it("returns 401 without auth", async () => {
    const cat = await seedCategory();
    const form = makeReportForm({ withImage: true, catId: cat.id });
    const res = await app.request("/v1/reports", { method: "POST", body: form });
    expect(res.status).toBe(401);
  });

  it("returns 400 when no image is provided", async () => {
    const cat = await seedCategory();
    const { cookie } = await createSession("nophoto@test.com", "password123456");
    const form = makeReportForm({ withImage: false, catId: cat.id });
    const res = await app.request("/v1/reports", {
      method: "POST",
      body: form,
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(false);
  });

  it("returns 400 when coordinates are outside Centro de Itapajé bbox", async () => {
    const cat = await seedCategory();
    const { cookie } = await createSession("outside@test.com", "password123456");
    const form = makeReportForm({ lat: OUTSIDE_LAT, lng: OUTSIDE_LNG, withImage: true, catId: cat.id });
    const res = await app.request("/v1/reports", {
      method: "POST",
      body: form,
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(false);
  });

  it("creates report with status=pending and expiresAt ~30 days from now", async () => {
    const cat = await seedCategory();
    const { cookie } = await createSession("valid@test.com", "password123456");
    const form = makeReportForm({ withImage: true, catId: cat.id });
    const res = await app.request("/v1/reports", {
      method: "POST",
      body: form,
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(true);
    const data = body.data as Record<string, unknown>;
    expect(data.status).toBe("pending");
    expect(data.expiresAt).toBeDefined();
    const expiresAt = new Date(data.expiresAt as string);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const diff = Math.abs(expiresAt.getTime() - thirtyDaysFromNow.getTime());
    expect(diff).toBeLessThan(60_000);
    expect(data.userId).toBeUndefined();
  });
});

describe("GET /v1/reports", () => {
  it("returns 200 with empty data when no active reports exist", async () => {
    const res = await app.request("/v1/reports");
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect((body.data as unknown[]).length).toBe(0);
  });

  it("does not return pending reports", async () => {
    const cat = await seedCategory();
    const user = await seedUser("pending@test.com");
    await testDb.insert(reports).values({
      title: "Pending report",
      lat: VALID_LAT,
      lng: VALID_LNG,
      status: "pending",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: user.id,
      categoryId: cat.id,
    });
    const res = await app.request("/v1/reports");
    const body = (await res.json()) as Record<string, unknown>;
    const data = body.data as Record<string, unknown>[];
    const found = data.find((r) => r.title === "Pending report");
    expect(found).toBeUndefined();
  });

  it("does not return expired reports (expiresAt in the past)", async () => {
    const cat = await seedCategory();
    const user = await seedUser("exp@test.com");
    await testDb.insert(reports).values({
      title: "Expired report",
      lat: VALID_LAT,
      lng: VALID_LNG,
      status: "active",
      expiresAt: new Date(Date.now() - 1000),
      userId: user.id,
      categoryId: cat.id,
    });
    const res = await app.request("/v1/reports");
    const body = (await res.json()) as Record<string, unknown>;
    const data = body.data as Record<string, unknown>[];
    const found = data.find((r) => r.title === "Expired report");
    expect(found).toBeUndefined();
  });

  it("does not expose userId in listing", async () => {
    const cat = await seedCategory();
    const user = await seedUser("priv@test.com");
    await testDb.insert(reports).values({
      title: "Active visible report",
      lat: VALID_LAT,
      lng: VALID_LNG,
      status: "active",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: user.id,
      categoryId: cat.id,
    });
    const res = await app.request("/v1/reports");
    const body = (await res.json()) as Record<string, unknown>;
    const data = body.data as Record<string, unknown>[];
    const found = data.find((r) => r.title === "Active visible report");
    expect(found).toBeDefined();
    expect((found as Record<string, unknown>).userId).toBeUndefined();
  });
});

describe("GET /v1/reports/:id", () => {
  it("returns 404 for an expired report", async () => {
    const cat = await seedCategory();
    const user = await seedUser("expdet@test.com");
    const inserted = await testDb
      .insert(reports)
      .values({
        title: "Expired detail",
        lat: VALID_LAT,
        lng: VALID_LNG,
        status: "active",
        expiresAt: new Date(Date.now() - 1000),
        userId: user.id,
        categoryId: cat.id,
      })
      .returning();
    const report = inserted[0]!;
    const res = await app.request(`/v1/reports/${report.id}`);
    expect(res.status).toBe(404);
  });

  it("returns detail with images and without userId for active report", async () => {
    const cat = await seedCategory();
    const user = await seedUser("detail@test.com");
    const inserted = await testDb
      .insert(reports)
      .values({
        title: "Active detail report",
        lat: VALID_LAT,
        lng: VALID_LNG,
        status: "active",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: user.id,
        categoryId: cat.id,
      })
      .returning();
    const report = inserted[0]!;
    const res = await app.request(`/v1/reports/${report.id}`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(true);
    const data = body.data as Record<string, unknown>;
    expect(data.id).toBe(report.id);
    expect(data.userId).toBeUndefined();
    expect(Array.isArray(data.images)).toBe(true);
  });
});
