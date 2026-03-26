const categoryService = require("../services/categoryService");

async function createCategory(req, res) {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            })
        }

        const category = await categoryService.createCategory(name)

        return res.status(201).json({
            success: true,
            data: category,
            message: "Category created successfully"
        })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message })
    }
}

async function findReportByCategoryId(req, res) {
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
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function findAllCategory(req, res) {
    try {
        const categories = await categoryService.findAllCategory();
        return res.json({
            success: true,
            data: categories,
            message: "Categories found successfully",
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    createCategory,
    findReportByCategoryId,
    findAllCategory
};
