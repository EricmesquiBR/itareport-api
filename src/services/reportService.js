const prismaClient = require("../db/prismaClient");

async function createReport(titulo, conteudo, id, idCat, rua, bairro, cidade, lat, lng) {
  const report = await prismaClient.Denuncia.create({
    data: {
            title: titulo,
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
  const report = await prismaClient.Denuncia.findFirst({
    where: { id_report: id },
  });

  return report;
}

async function findAllReport() {
  const reports = await prismaClient.Denuncia.findMany();
  return reports;
}

async function updateReport(id, title, content, street, district, city, lat, lng, catId) {
  const report = await prismaClient.Denuncia.update({
    where: { id_report: id },
    data: { title, content, street, district, city, lat, lng, catId },
  });

  return report;
}

async function deleteReportById(id) {
  return prismaClient.Denuncia.delete({ where: { id_report: String(id) } });
}
module.exports = {
  createReport,
  findReportById,
  findAllReport,
  updateReport,
  deleteReportById
};
