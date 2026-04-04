import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as reportService from "./report.service.js";
import { createReportSchema, updateReportSchema } from "./report.schema.js";
import { authMiddleware, getAuthUserId } from "../../middleware/auth.js";

export const reportRoutes = new Hono()
  .post("/", authMiddleware(), zValidator("json", createReportSchema), async (c) => {
    const body = c.req.valid("json");
    const userId = getAuthUserId(c);

    const report = await reportService.createReport({
      title: body.title,
      content: body.content,
      userId,
      categoryId: body.idCat,
      street: body.street,
      district: body.district,
      city: body.city,
      lat: body.lat,
      lng: body.lng,
    });

    return c.json({ success: true, data: report, message: "Report created successfully" }, 201);
  })
  .get("/", async (c) => {
    const reports = await reportService.findAllReports();

    return c.json({
      success: true,
      data: reports,
      message: "Reports found successfully",
    });
  })
  .get("/:id", async (c) => {
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
  })
  .put("/:id", authMiddleware(), zValidator("json", updateReportSchema), async (c) => {
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
      categoryId: body.catId,
    });

    return c.json({
      success: true,
      data: updatedReport,
      message: "Report updated successfully",
    });
  })
  .delete("/:id", authMiddleware(), async (c) => {
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
  });
