const reportService = require("../services/reportService")

async function createReport(req, res) {
  try {
    const { title, content, id, idCat, street, district, city, lat, lng } = req.body
    const report = await reportService.createReport(title, content, id, idCat, street, district, city, lat, lng)

    return res.status(201).json({
      success: true,
      data: report,
      message: "Report created successfully",
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

async function findReportById(req, res) {
  try {
    const { id } = req.params
    const report = await reportService.findReportById(id)

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Could not find this report",
      })
    }

    return res.json({
      success: true,
      data: report,
      message: "Report found successfully",
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
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
    return res.status(500).json({ success: false, error: error.message })
  }
}

async function updateReport(req, res) {
  try {
    const { id } = req.params
    const { title, content, street, district, city, lat, lng, catId } = req.body

    const report = await reportService.findReportById(id)

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Could not find this report",
      })
    }

    const updatedReport = await reportService.updateReport(
      id, title, content, street, district, city, lat, lng, catId
    )

    return res.json({
      success: true,
      data: updatedReport,
      message: "Report updated successfully",
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

async function deleteReport(req, res) {
  try {
    const { id } = req.params
    const report = await reportService.findReportById(id)

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Could not find this report",
      })
    }

    await reportService.deleteReportById(id)
    return res.json({
      success: true,
      data: { id },
      message: "Report deleted successfully",
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

module.exports = {
  createReport,
  findReportById,
  findAllReports,
  updateReport,
  deleteReport
}
