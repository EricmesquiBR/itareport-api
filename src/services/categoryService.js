const prismaClient = require("../db/prismaClient");

async function createCategory(name){
    const category = await prismaClient.Categoria.create({
        data: { nome_categoria: name},
    })

    return category
}


async function findReportByCategory(id) {
    const reports = await prismaClient.Denuncia.findMany({
      where: { catId: id },
    });

    return reports;
  }
  
  async function findAllCategory() {
    const category = await prismaClient.Categoria.findMany();
    return category;
  }

  module.exports = {
    findReportByCategory,
    findAllCategory,
    createCategory
  };