import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as reportService from "./report.service.js";
import { createReportSchema, updateReportSchema } from "./report.schema.js";
import { authMiddleware, getAuthUserId } from "../../middleware/auth.js";
import { logger } from "../../lib/logger.js";

export const reportRoutes = new Hono()
  .post("/", authMiddleware(), zValidator("json", createReportSchema), async (c) => {
    try {
      const body = c.req.valid("json");
      const userId = getAuthUserId(c);

      const report = await reportService.createReport({
        title: body.title,
        content: body.content,
        userId,
        categoryId: body.categoryId,
        street: body.street,
        district: body.district,
        city: body.city,
        lat: body.lat,
        lng: body.lng,
      });

      if (!report) {
        return c.json(
          { success: false, message: "Failed to create report" },
          500,
        );
      }

      return c.json({ success: true, data: report, message: "Report created successfully" }, 201);
    } catch (error) {
      logger.error(error, "Error creating report");
      return c.json(
        { success: false, message: "Failed to create report" },
        500,
      );
    }
  })
  .get("/", async (c) => {
    try {
      const limit = parseInt(c.req.query("limit") ?? "50");
      const offset = parseInt(c.req.query("offset") ?? "0");

      const result = await reportService.findAllReports({
        limit: Math.min(limit, 100),
        offset: Math.max(offset, 0),
      });

      return c.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
        },
        message: "Reports found successfully",
      });
    } catch (error) {
      logger.error(error, "Error fetching reports");
      return c.json(
        { success: false, message: "Failed to fetch reports" },
        500,
      );
    }
  })
  .get("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const report = await reportService.findReportById(id);

      if (!report) {
        return c.json({ success: false, message: "Could not find this report" }, 404);
      }

      return c.json({
        success: true,
        data: report,
        message: "Report found successfully",
      });
    } catch (error) {
      logger.error(error, "Error fetching report");
      return c.json(
        { success: false, message: "Failed to fetch report" },
        500,
      );
    }
  })
  .put("/:id", authMiddleware(), zValidator("json", updateReportSchema), async (c) => {
    try {
      const { id } = c.req.param();
      const body = c.req.valid("json");
      const authUserId = getAuthUserId(c);

      const existing = await reportService.findReportById(id);
      if (!existing) {
        return c.json({ success: false, message: "Could not find this report" }, 404);
      }

      if (existing.userId !== authUserId) {
        return c.json({ success: false, message: "Forbidden" }, 403);
      }

      const updatedReport = await reportService.updateReport(id, {
        title: body.title,
        content: body.content,
        street: body.street,
        district: body.district,
        city: body.city,
        lat: body.lat,
        lng: body.lng,
        categoryId: body.categoryId,
      });

      if (!updatedReport) {
        return c.json(
          { success: false, message: "Failed to update report" },
          500,
        );
      }

      return c.json({
        success: true,
        data: updatedReport,
        message: "Report updated successfully",
      });
    } catch (error) {
      logger.error(error, "Error updating report");
      return c.json(
        { success: false, message: "Failed to update report" },
        500,
      );
    }
  })
  .delete("/:id", authMiddleware(), async (c) => {
    try {
      const { id } = c.req.param();
      const authUserId = getAuthUserId(c);

      const existing = await reportService.findReportById(id);
      if (!existing) {
        return c.json({ success: false, message: "Could not find this report" }, 404);
      }

      if (existing.userId !== authUserId) {
        return c.json({ success: false, message: "Forbidden" }, 403);
      }

      await reportService.deleteReportById(id);

      return c.json({
        success: true,
        data: { id },
        message: "Report deleted successfully",
      });
    } catch (error) {
      logger.error(error, "Error deleting report");
      return c.json(
        { success: false, message: "Failed to delete report" },
        500,
      );
    }
  });
