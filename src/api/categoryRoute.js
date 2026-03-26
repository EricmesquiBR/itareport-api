import * as categoryController from "../controllers/categoryController.js";
import express from "express";

const router = express.Router();

router.post("/category", categoryController.createCategory);
router.get("/category/:id", categoryController.findReportByCategoryId);
router.get("/category", categoryController.findAllCategory);

export default router;
