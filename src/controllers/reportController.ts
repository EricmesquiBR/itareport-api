import * as reportService from "../services/reportService.js";
import type { Request, Response } from "express";

export async function createReport(req: Request, res: Response) {
  try {
    const { title, content, id, idCat, street, district, city, lat, lng } = req.body;
    const report = await reportService.createReport(
      title,
      content,
      id,
      idCat,
      street,
      district,
      city,
      lat,
      lng,
    );

    return res.status(201).json({
      success: true,
      data: report,
      message: "Report created successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function findReportById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const report = await reportService.findReportById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Could not find this report",
      });
    }

    return res.json({
      success: true,
      data: report,
      message: "Report found successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function findAllReports(_req: Request, res: Response) {
  try {
    const reports = await reportService.findAllReport();

    return res.json({
      success: true,
      data: reports,
      message: "Reports found successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateReport(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, content, street, district, city, lat, lng, catId } = req.body;

    const report = await reportService.findReportById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Could not find this report",
      });
    }

    const updatedReport = await reportService.updateReport(
      id,
      title,
      content,
      street,
      district,
      city,
      lat,
      lng,
      catId,
    );

    return res.json({
      success: true,
      data: updatedReport,
      message: "Report updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteReport(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const report = await reportService.findReportById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Could not find this report",
      });
    }

    await reportService.deleteReportById(id);
    return res.json({
      success: true,
      data: { id },
      message: "Report deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
