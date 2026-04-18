import { describe, expect, it } from "vitest";
import { Writable } from "node:stream";
import pino from "pino";
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

describe("PII redaction in logger", () => {
  function makeLogger() {
    const lines: string[] = [];
    const stream = new Writable({
      write(chunk, _enc, cb) {
        lines.push(chunk.toString());
        cb();
      },
    });
    const log = pino(
      {
        level: "info",
        redact: {
          paths: [
            "email",
            "password",
            "token",
            "ip",
            "ipAddress",
            "*.email",
            "*.password",
            "*.token",
          ],
          censor: "[Redacted]",
        },
      },
      stream,
    );
    return { log, lines };
  }

  it("redacts email from log entries", () => {
    const { log, lines } = makeLogger();
    log.info({ email: "user@example.com" }, "test");
    const entry = JSON.parse(lines[0]!);
    expect(entry.email).toBe("[Redacted]");
  });

  it("redacts password from log entries", () => {
    const { log, lines } = makeLogger();
    log.info({ password: "s3cret" }, "test");
    const entry = JSON.parse(lines[0]!);
    expect(entry.password).toBe("[Redacted]");
  });

  it("redacts ip from log entries", () => {
    const { log, lines } = makeLogger();
    log.info({ ip: "192.168.1.1" }, "test");
    const entry = JSON.parse(lines[0]!);
    expect(entry.ip).toBe("[Redacted]");
  });

  it("redacts token from log entries", () => {
    const { log, lines } = makeLogger();
    log.info({ token: "bearer-abc123" }, "test");
    const entry = JSON.parse(lines[0]!);
    expect(entry.token).toBe("[Redacted]");
  });
});
