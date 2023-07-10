const reportService = require("../services/reportService")

async function createReport(req, res) {
  try {
    const { title, content, id, idCat, street, district, city, lat, lng } = req.body
    const report = await reportService.createReport(title, content, id, idCat, street, district, city, lat, lng)

    const reportData = { id, title, content }

    return res.json({
      success: true,
      data: reportData,
      message: "Report created successfully",
    })
    
  } catch (error) {
    return res.json({ message: "Erro :(" })
  }
}

async function findReportById(req,res){
  try{
    const { id } = req.params

    const report =  await reportService.findReportById(id)

    if (!report) {
      return res.json({
        success: false,
        data: report ,
        message: "Could not find this report",
      })
    }

    return res.json({
      success: true,
      data: report,
      message: "report found successfully",
    })

  }catch(error){
    return res.json({ error })
  }
}

async function findAllReports(req, res) {
  try {
    const reports = await reportService.findAllReport()

    return res.json({
      success: true,
      data: reports,
      message: "Reports found successfully",
    })

  } catch (error) {
    return res.json({ error })
  }
}

async function updateReport(req,res){
  try{
    const { id } = req.params

    const report =  await reportService.findReportById(id)

    if (!report) {
      return res.json({
        success: false,
        data: report,
        message: "The update is not yet available",
      })

    }
  }catch(error){
    return res.json({ error })
  }
}

async function deleteReport(req, res) {
  try {
    const { id } = req.params

    const report = await reportService.findReportById(id)

    if (!report) {
      return res.json({
        success: false,
        data: id,
        message: "Could not find this report",
      })
    }

    await reportService.deleteReportById(id)
    return res.json({
      success: true,
      data: id,
      message: "Report deleted successfully",
    })

  } catch (error) {
    return res.json({ error })
  }
}

module.exports = {
  createReport,
  findReportById,
  findAllReports,
  updateReport,
  deleteReport

}
