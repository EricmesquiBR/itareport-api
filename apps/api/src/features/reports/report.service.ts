import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { reports } from "../../db/schema.js";

interface CreateReportInput {
  title: string;
  userId: string;
  categoryId: string;
  lat: number;
  lng: number;
}

interface UpdateReportInput {
  title?: string;
  lat?: number;
  lng?: number;
  categoryId?: string;
}

interface PaginationParams {
  limit: number;
  offset: number;
}

export async function createReport(input: CreateReportInput) {
  const [report] = await db.insert(reports).values(input).returning();
  return report;
}

export async function findReportById(id: string) {
  const [report] = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
  return report;
}

export async function findAllReports({ limit, offset }: PaginationParams) {
  const [data, countResult] = await Promise.all([
    db.select().from(reports).limit(limit).offset(offset),
    db.select({ count: reports.id }).from(reports),
  ]);

  return {
    data,
    total: countResult.length,
    limit,
    offset,
  };
}

export async function updateReport(id: string, data: UpdateReportInput) {
  const [report] = await db.update(reports).set(data).where(eq(reports.id, id)).returning();
  return report;
}

export async function deleteReportById(id: string) {
  const [deletedReport] = await db.delete(reports).where(eq(reports.id, id)).returning();
  return deletedReport;
}
