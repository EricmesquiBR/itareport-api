const categoryService = require("../services/categoryService");

async function findReportByCategoryId(req,res){
    try{
      const { id } = req.params;
  
      const report =  await categoryService.findReportByCategory(id);
  
      if (!report) {
        return res.json({
          success: false,
          data: { report },
          message: "Could not find reports in this category",
        });
      }
  
      return res.json({
        success: true,
        data: report,
        message: "report of this category successfully found",
      });
    }catch(error){
      return res.json({ error });
    }
  }
  
  async function findAllCategory(req, res) {
    try {
      const category = await categoryService.findAllCategory();
      return res.json({
        success: true,
        data: category,
        message: "Reports found successfully",
      });
    } catch (error) {
      return res.json({ error });
    }
  }

  module.exports = {
    findReportByCategoryId,
    findAllCategory
  };