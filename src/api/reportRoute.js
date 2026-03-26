import * as reportController from "../controllers/reportController.js";
import express from "express";

const router = express.Router();

router.post("/report", reportController.createReport);
router.get("/report/:id", reportController.findReportById);
router.get("/reports", reportController.findAllReports);
router.put("/report/:id", reportController.updateReport);
router.delete("/report/:id", reportController.deleteReport);

export default router;
