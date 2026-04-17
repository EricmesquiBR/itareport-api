import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { app } from "../app.js";
import { testDb } from "./db.js";
import { users } from "../db/schema.js";

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

describe("GET /v1/users/me", () => {
  it("returns 401 without auth", async () => {
    const res = await app.request("/v1/users/me");
    expect(res.status).toBe(401);
  });

  it("returns id, username, createdAt — no email — when authenticated", async () => {
    const { cookie } = await createSession("me@test.com", "password123456");

    const res = await app.request("/v1/users/me", {
      headers: { Cookie: cookie },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, any>;
    expect(body.success).toBe(true);
    expect(body.data.id).toMatch(/^usr_/);
    expect(body.data.username).toMatch(/^[a-z]+-[a-z]+-\d{1,4}$/);
    expect(body.data.createdAt).toBeDefined();
    expect(body.data.email).toBeUndefined();
  });
});

describe("DELETE /v1/users/me", () => {
  it("soft-deletes: row stays, deletedAt set", async () => {
    const email = "softdelete@test.com";
    const { cookie } = await createSession(email, "password123456");

    const res = await app.request("/v1/users/me", {
      method: "DELETE",
      headers: { Cookie: cookie },
    });

    expect(res.status).toBe(200);

    const [user] = await testDb
      .select()
      .from(users)
      .where(eq(users.email, email));
    expect(user).toBeDefined();
    expect(user!.deletedAt).not.toBeNull();
  });

  it("sign-in after soft-delete returns 401", async () => {
    const email = "blocked@test.com";
    const password = "password123456";
    const { cookie } = await createSession(email, password);

    await app.request("/v1/users/me", {
      method: "DELETE",
      headers: { Cookie: cookie },
    });

    const { res } = await signIn(email, password);
    expect(res.status).toBe(401);
  });
});
