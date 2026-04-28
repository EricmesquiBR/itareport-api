import { Hono } from "hono";
import { authMiddleware, getAuthUserId } from "../../middleware/auth.js";
import * as userService from "./user.service.js";
import { logger } from "../../lib/logger.js";

export const userRoutes = new Hono()
  .get("/me", authMiddleware(), async (c) => {
    try {
      const authUserId = getAuthUserId(c);
      const user = await userService.findUserById(authUserId);

      if (!user) {
        return c.json({ success: false, message: "Could not find this user" }, 404);
      }

      return c.json({
        success: true,
        data: { id: user.id, username: user.username, createdAt: user.createdAt },
        message: "User found successfully",
      });
    } catch (error) {
      logger.error(error, "Error fetching user");
      return c.json({ success: false, message: "Failed to fetch user" }, 500);
    }
  })
  .delete("/me", authMiddleware(), async (c) => {
    try {
      const authUserId = getAuthUserId(c);

      const existing = await userService.findUserById(authUserId);
      if (!existing) {
        return c.json({ success: false, message: "Could not find this user" }, 404);
      }

      await userService.softDeleteUser(authUserId);

      return c.json({ success: true, data: { id: authUserId }, message: "User deleted successfully" });
    } catch (error) {
      logger.error(error, "Error deleting user");
      return c.json({ success: false, message: "Failed to delete user" }, 500);
    }
  });
