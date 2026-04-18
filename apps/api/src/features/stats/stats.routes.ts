import { Hono } from "hono";
import { getStats } from "./stats.service.js";
import { logger } from "../../lib/logger.js";

export const statsRoutes = new Hono().get("/", async (c) => {
  try {
    const data = await getStats();
    return c.json({ success: true, data });
  } catch (error) {
    logger.error(error, "Failed to fetch stats");
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
});
