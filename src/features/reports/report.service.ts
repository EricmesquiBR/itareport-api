import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { reports } from "../../db/schema.js";

interface CreateReportInput {
  title: string;
  content: string;
  userId: string;
  categoryId: string;
  street: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
}

interface UpdateReportInput {
  title?: string;
  content?: string;
  street?: string;
  district?: string;
  city?: string;
  lat?: number;
  lng?: number;
  categoryId?: string;
}

export async function createReport(input: CreateReportInput) {
  const [report] = await db.insert(reports).values(input).returning();
  return report;
}

export async function findReportById(id: string) {
  const report = await db.query.reports.findFirst({
    where: eq(reports.id, id),
  });
  return report;
}

export async function findAllReports() {
  const reportsList = await db.query.reports.findMany();
  return reportsList;
}

export async function updateReport(id: string, data: UpdateReportInput) {
  const [report] = await db.update(reports).set(data).where(eq(reports.id, id)).returning();
  return report;
}

export async function deleteReportById(id: string) {
  const [deletedReport] = await db.delete(reports).where(eq(reports.id, id)).returning();
  return deletedReport;
}
