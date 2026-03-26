import { db } from "../db/index.ts";
import { reports } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export async function createReport(titulo, conteudo, idUser, idCat, rua, bairro, cidade, lat, lng) {
  const [report] = await db
    .insert(reports)
    .values({
      title: titulo,
      content: conteudo,
      userId: idUser,
      categoryId: idCat,
      street: rua,
      district: bairro,
      city: cidade,
      lat: lat,
      lng: lng,
    })
    .returning();

  return report;
}

export async function findReportById(id) {
  const report = await db.query.reports.findFirst({
    where: eq(reports.id, id),
  });

  return report;
}

export async function findAllReport() {
  const reportsList = await db.query.reports.findMany();
  return reportsList;
}

export async function updateReport(
  id,
  title,
  content,
  street,
  district,
  city,
  lat,
  lng,
  categoryId,
) {
  const [report] = await db
    .update(reports)
    .set({ title, content, street, district, city, lat, lng, categoryId })
    .where(eq(reports.id, id))
    .returning();

  return report;
}

export async function deleteReportById(id) {
  const [deletedReport] = await db.delete(reports).where(eq(reports.id, id)).returning();
  return deletedReport;
}
