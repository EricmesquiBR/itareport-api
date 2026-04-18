import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { getConnInfo } from "@hono/node-server/conninfo";

import { userRoutes } from "./features/users/user.routes.js";
import { reportRoutes } from "./features/reports/report.routes.js";
import { categoryRoutes } from "./features/categories/category.routes.js";
import { statsRoutes } from "./features/stats/stats.routes.js";
import { auth } from "./lib/auth.js";
import { findUserByEmail } from "./features/users/user.service.js";
import { logger } from "./lib/logger.js";
import { env } from "./env.js";
import { correlationIdMiddleware } from "./middleware/correlation-id.js";

export const app = new Hono();

app.use("*", correlationIdMiddleware());

app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  let ip: string | undefined;
  try {
    ip = getConnInfo(c).remote.address;
  } catch {
    ip = undefined;
  }
  logger.info(
    {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      ms,
      ip,
      requestId: c.get("requestId"),
    },
    `HTTP ${c.req.method} ${c.req.path}`,
  );
});

if (env.NODE_ENV === "development") {
  app.use("*", prettyJSON());
}

const isWildcardOrigin = env.CORS_ORIGIN === "*";
app.use(
  "*",
  cors({
    origin: isWildcardOrigin
      ? "*"
      : env.CORS_ORIGIN.split(",").map((o) => o.trim()),
    credentials: !isWildcardOrigin,
    maxAge: 604800,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }),
);

app.get("/v1/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.on(["GET", "POST"], "/api/auth/**", async (c) => {
  if (c.req.method === "POST" && c.req.path === "/api/auth/sign-in/email") {
    const body = await c.req.raw.clone().json().catch(() => null);
    if (body?.email) {
      const user = await findUserByEmail(body.email);
      if (user?.deletedAt) {
        return c.json({ success: false, message: "Invalid credentials" }, 401);
      }
    }
  }
  return auth.handler(c.req.raw);
});

const v1 = new Hono();
v1.route("/users", userRoutes);
v1.route("/reports", reportRoutes);
v1.route("/categories", categoryRoutes);
v1.route("/stats", statsRoutes);

app.route("/v1", v1);

app.onError((err, c) => {
  logger.error(err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});
