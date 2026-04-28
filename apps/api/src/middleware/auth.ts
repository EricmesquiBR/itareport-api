import type { Context, MiddlewareHandler } from "hono";
import { auth } from "../lib/auth.js";

export function authMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ success: false, message: "Authentication required" }, 401);
    }

    c.set("userId", session.user.id);
    await next();
  };
}

export function getAuthUserId(c: Context): string {
  const userId = c.get("userId") as string | undefined;
  if (!userId) {
    throw new Error("User ID not found in context. Auth middleware not applied.");
  }
  return userId;
}
