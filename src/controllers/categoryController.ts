import * as categoryService from "../services/categoryService.js";
import type { Request, Response } from "express";

export async function createCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await categoryService.createCategory(name);

    return res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function findReportByCategoryId(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const reports = await categoryService.findReportByCategory(id);

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Could not find reports in this category",
      });
    }

    return res.json({
      success: true,
      data: reports,
      message: "Reports of this category successfully found",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function findAllCategory(_req: Request, res: Response) {
  try {
    const categories = await categoryService.findAllCategory();
    return res.json({
      success: true,
      data: categories,
      message: "Categories found successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
