const categoryController = require("../controllers/categoryController");

const express = require("express");
const router = express.Router();

router.post("/category/:id", categoryController.createCategorys)
router.get("/category", categoryController.findAllCategory);
router.get("/category/:id", categoryController.findReportByCategoryId);

module.exports = router;