import type { MiddlewareHandler } from "hono";
import { randomUUID } from "node:crypto";

export function correlationIdMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const id = c.req.header("X-Request-ID") ?? randomUUID();
    c.set("requestId", id);
    await next();
    c.header("X-Request-ID", id);
  };
}
