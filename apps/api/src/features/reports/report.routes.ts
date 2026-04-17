import { Hono } from "hono";
import { getConnInfo } from "@hono/node-server/conninfo";
import * as reportService from "./report.service.js";
import { authMiddleware, getAuthUserId } from "../../middleware/auth.js";
import { isInsideBbox, fuzzCoords } from "../../lib/geofencing.js";
import { processImage } from "../../lib/image.js";
import { uploadImage } from "../../lib/storage.js";
import { checkRateLimit } from "../../lib/rate-limit.js";
import { logger } from "../../lib/logger.js";

function extractIp(c: any): string {
  try {
    return getConnInfo(c).remote.address ?? "unknown";
  } catch {
    return "unknown";
  }
}

export const reportRoutes = new Hono()
  .post("/", authMiddleware(), async (c) => {
    try {
      const ip = extractIp(c);
      const rateCheck = checkRateLimit(ip);
      if (!rateCheck.allowed) {
        return c.json(
          { success: false, message: "Rate limit exceeded. Try again later." },
          429,
        );
      }

      const formData = await c.req.formData();
      const title = formData.get("title");
      const lat = formData.get("lat");
      const lng = formData.get("lng");
      const categoryId = formData.get("categoryId");
      const imageFile = formData.get("image");

      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return c.json({ success: false, message: "title is required" }, 400);
      }
      if (!categoryId || typeof categoryId !== "string") {
        return c.json({ success: false, message: "categoryId is required" }, 400);
      }
      if (lat === null || lng === null) {
        return c.json({ success: false, message: "lat and lng are required" }, 400);
      }

      const latNum = parseFloat(String(lat));
      const lngNum = parseFloat(String(lng));

      if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
        return c.json({ success: false, message: "lat and lng must be numbers" }, 400);
      }

      if (!imageFile || !(imageFile instanceof File)) {
        return c.json({ success: false, message: "image is required" }, 400);
      }

      if (!isInsideBbox(latNum, lngNum)) {
        return c.json(
          { success: false, message: "Coordinates are outside the allowed area" },
          400,
        );
      }

      const { lat: fuzzedLat, lng: fuzzedLng } = fuzzCoords(latNum, lngNum);
      const userId = getAuthUserId(c);

      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const { original } = await processImage(imageBuffer);

      const dateStr = new Date().toISOString().slice(0, 10);
      const storageKey = `reports/${dateStr}/primary_${Date.now()}.webp`;

      await uploadImage(storageKey, original);

      const report = await reportService.createReport(
        { title: title.trim(), lat: fuzzedLat, lng: fuzzedLng, userId, categoryId },
        storageKey,
      );

      return c.json({ success: true, data: report, message: "Report created successfully" }, 201);
    } catch (error) {
      logger.error(error, "Error creating report");
      return c.json({ success: false, message: "Failed to create report" }, 500);
    }
  })
  .get("/", async (c) => {
    try {
      const page = Math.max(1, parseInt(c.req.query("page") ?? "1"));
      const limit = Math.min(100, Math.max(1, parseInt(c.req.query("limit") ?? "20")));
      const categoryId = c.req.query("categoryId");
      const offset = (page - 1) * limit;

      const result = await reportService.findActiveReports({ limit, offset, categoryId });

      return c.json({
        success: true,
        data: result.data,
        pagination: { total: result.total, page, limit, offset },
        message: "Reports found successfully",
      });
    } catch (error) {
      logger.error(error, "Error fetching reports");
      return c.json({ success: false, message: "Failed to fetch reports" }, 500);
    }
  })
  .get("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const report = await reportService.findReportById(id);

      if (!report) {
        return c.json({ success: false, message: "Report not found" }, 404);
      }

      return c.json({ success: true, data: report, message: "Report found successfully" });
    } catch (error) {
      logger.error(error, "Error fetching report");
      return c.json({ success: false, message: "Failed to fetch report" }, 500);
    }
  });
