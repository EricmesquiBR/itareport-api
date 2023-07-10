const prismaClient = require("../db/prismaClient");

async function findReportByCategory(id) {
    const repor = prismaClient.Denuncia.findMany({
      where: { catId: id },
    });
  
    return repor;
  }
  
  async function findAllCategory() {
    const reports = await prismaClient.Categoria.findMany();
    return reports;
  }

  module.exports = {
    findReportByCategory,
    findAllCategory
  };