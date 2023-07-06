const reportController = require("../controllers/reportController");

const express = require("express");
const router = express.Router();

router.post("/report", reportController.createReport);
router.get("/reports", reportController.findAllReports);
router.get("/report/:id", reportController.findReportById);
router.put("/report/:id", reportController.UpdateReport);
router.delete("/report/:id", reportController.deleteReport);

module.exports = router;
