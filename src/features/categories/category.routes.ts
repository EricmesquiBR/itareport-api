import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as categoryService from "./category.service.js";
import { createCategorySchema } from "./category.schema.js";

export const categoryRoutes = new Hono()
  .post("/", zValidator("json", createCategorySchema), async (c) => {
    const { name } = c.req.valid("json");
    const category = await categoryService.createCategory(name);

    return c.json({ success: true, data: category, message: "Category created successfully" }, 201);
  })
  .get("/", async (c) => {
    const categories = await categoryService.findAllCategories();

    return c.json({
      success: true,
      data: categories,
      message: "Categories found successfully",
    });
  })
  .get("/:id/reports", async (c) => {
    const { id } = c.req.param();
    const reports = await categoryService.findReportsByCategory(id);

    if (!reports || reports.length === 0) {
      return c.json({ success: false, message: "Could not find reports in this category" }, 404);
    }

    return c.json({
      success: true,
      data: reports,
      message: "Reports of this category successfully found",
    });
  });
