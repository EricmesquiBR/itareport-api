import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as categoryService from "./category.service.js";
import { createCategorySchema } from "./category.schema.js";
import { logger } from "../../lib/logger.js";

export const categoryRoutes = new Hono()
  .post("/", zValidator("json", createCategorySchema), async (c) => {
    try {
      const { name, slug } = c.req.valid("json");
      const category = await categoryService.createCategory(name, slug);

      if (!category) {
        return c.json(
          { success: false, message: "Failed to create category" },
          500,
        );
      }

      return c.json({ success: true, data: category, message: "Category created successfully" }, 201);
    } catch (error) {
      logger.error(error, "Error creating category");
      return c.json(
        { success: false, message: "Failed to create category" },
        500,
      );
    }
  })
  .get("/", async (c) => {
    try {
      const categories = await categoryService.findAllCategories();

      return c.json({
        success: true,
        data: categories,
        message: "Categories found successfully",
      });
    } catch (error) {
      logger.error(error, "Error fetching categories");
      return c.json(
        { success: false, message: "Failed to fetch categories" },
        500,
      );
    }
  })
  .get("/:id/reports", async (c) => {
    try {
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
    } catch (error) {
      logger.error(error, "Error fetching reports by category");
      return c.json(
        { success: false, message: "Failed to fetch reports" },
        500,
      );
    }
  });
