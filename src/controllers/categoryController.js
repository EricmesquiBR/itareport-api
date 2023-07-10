const categoryService = require("../services/categoryService");


async function createCategorys(req, res) {
    try {
        const { id } = req.params
        const { name} = req.body

        if (id == '7fbd96fd-130d-42ab-b0b8-de1d85311629'){

            category = await categoryService.createCategory(name)

            return res.json({
                success: true,
                data: category,
                message: "Category created successfully"
            })
        }else{
            return res.json({
                message: "User does not have permission for this action"
            })
        }
        
    } catch (error) {
        return res.json({ error })
    }
}



async function findReportByCategoryId(req,res){
    try{
      const { id } = req.params;
  
      const report =  await categoryService.findReportByCategory(id);
  
      if (!report) {
        return res.json({
          success: false,
          data: report,
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
    createCategorys,
    findReportByCategoryId,
    findAllCategory
  };