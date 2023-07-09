const prismaClient = require("../db/prismaClient");

async function createReport(titulo, conteudo, id, idCat, rua, bairro, cidade, lat, lng) {
  const report = await prismaClient.Denuncia.create({
    data: { title: titulo,
            content: conteudo,
            userId: id,
            catId: idCat,
            street: rua,
            district: bairro,
            city: cidade, 
            lat: lat,
            lng: lng
           },
  });

  return report;
}

async function findReportById(id) {
  const repor = prismaClient.Denuncia.findFirst({
    where: { id_report: id },
  });

  return repor;
}

async function findAllReport() {
  const reports = await prismaClient.Denuncia.findMany();
  return reports;
}

async function UpdateReport() {
  return null;
}

async function deleteReportById(id) {
  return prismaClient.Denuncia.delete({ where: { id_report: String(id) } });
}
module.exports = {
  createReport,
  findReportById,
  findAllReport,
  UpdateReport,
  deleteReportById
};
