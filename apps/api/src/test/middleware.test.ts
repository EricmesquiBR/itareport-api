import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("correlation ID middleware", () => {
  it("attaches X-Request-ID to every response", async () => {
    const res = await app.request("/v1/health");
    expect(res.headers.get("X-Request-ID")).toBeTruthy();
  });

  it("generates unique X-Request-ID per request", async () => {
    const [r1, r2] = await Promise.all([
      app.request("/v1/health"),
      app.request("/v1/health"),
    ]);
    const id1 = r1.headers.get("X-Request-ID");
    const id2 = r2.headers.get("X-Request-ID");
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });
});
