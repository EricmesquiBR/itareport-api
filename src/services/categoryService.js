const prismaClient = require("../db/prismaClient");

async function createCategory(name){
    const cate = prismaClient.Categoria.create({
        data: { nome_categoria: name},
    })
}


async function findReportByCategory(id) {
    const repor = prismaClient.Denuncia.findMany({
      where: { catId: id },
    });
  
    return repor;
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