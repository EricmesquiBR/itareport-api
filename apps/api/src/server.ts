import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { getConnInfo } from "@hono/node-server/conninfo";
import { rateLimiter } from "hono-rate-limiter";

import { userRoutes } from "./features/users/user.routes.js";
import { reportRoutes } from "./features/reports/report.routes.js";
import { categoryRoutes } from "./features/categories/category.routes.js";
import { logger } from "./lib/logger.js";
import { env } from "./env.js";

const app = new Hono();

/**
 * Structured logging with Pino.
 * Intercepts all requests to provide detailed performance and status metrics.
 */
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(
    {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      ms,
      ip: getConnInfo(c).remote.address,
    },
    `HTTP ${c.req.method} ${c.req.path}`,
  );
});

/**
 * Pretty JSON middleware enables "JSON pretty print" for JSON response body.
 * Only enabled in development.
 */
if (env.NODE_ENV === "development") {
  app.use("*", prettyJSON());
}

/**
 * CORS Middleware
 */
app.use(
  "*",
  cors({
    origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true,
    maxAge: 604800, // 7 days
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }),
);

/**
 * Rate limiting middleware for Hono.
 * Prevents abuse by limiting the number of requests per IP.
 */
app.use(
  "*",
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: "draft-6",
    keyGenerator: (c) => getConnInfo(c).remote.address || "unknown",
    message: { success: false, message: "Too many requests, please try again later." },
  }),
);

// API v1
const v1 = new Hono();
v1.route("/users", userRoutes);
v1.route("/reports", reportRoutes);
v1.route("/categories", categoryRoutes);

app.route("/v1", v1);

// Error Handler
app.onError((err, c) => {
  logger.error(err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

serve({ fetch: app.fetch, port: env.PORT, hostname: env.HOST }, (info) => {
  logger.info(`Server running on ${info.address}:${info.port}`);
});
