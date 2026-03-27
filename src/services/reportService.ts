import { db } from "../db/index.js";
import { reports } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function createReport(
  titulo: any,
  conteudo: any,
  idUser: any,
  idCat: any,
  rua: any,
  bairro: any,
  cidade: any,
  lat: any,
  lng: any,
) {
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

export async function findReportById(id: any) {
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
  id: any,
  title: any,
  content: any,
  street: any,
  district: any,
  city: any,
  lat: any,
  lng: any,
  categoryId: any,
) {
  const [report] = await db
    .update(reports)
    .set({ title, content, street, district, city, lat, lng, categoryId })
    .where(eq(reports.id, id))
    .returning();

  return report;
}

export async function deleteReportById(id: any) {
  const [deletedReport] = await db.delete(reports).where(eq(reports.id, id)).returning();
  return deletedReport;
}
