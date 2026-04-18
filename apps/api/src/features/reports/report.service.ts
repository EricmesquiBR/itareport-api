import { and, count, eq, gt } from "drizzle-orm";
import { db } from "../../db/index.js";
import { reportImages, reports } from "../../db/schema.js";

interface CreateReportInput {
  title: string;
  userId: string;
  categoryId: string;
  lat: number;
  lng: number;
}

interface PaginationParams {
  limit: number;
  offset: number;
  categoryId?: string;
}

const PUBLIC_COLS = {
  id: reports.id,
  title: reports.title,
  lat: reports.lat,
  lng: reports.lng,
  status: reports.status,
  credibility: reports.credibility,
  upvotes: reports.upvotes,
  categoryId: reports.categoryId,
  expiresAt: reports.expiresAt,
  createdAt: reports.createdAt,
  updatedAt: reports.updatedAt,
};

export async function createReport(input: CreateReportInput, storageKey: string) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const result = await db
    .insert(reports)
    .values({
      title: input.title,
      lat: input.lat,
      lng: input.lng,
      userId: input.userId,
      categoryId: input.categoryId,
      status: "pending",
      expiresAt,
    })
    .returning(PUBLIC_COLS);

  const report = result[0]!;

  await db.insert(reportImages).values({
    reportId: report.id,
    storageKey,
    isPrimary: true,
  });

  return report;
}

export async function findActiveReports({ limit, offset, categoryId }: PaginationParams) {
  const now = new Date();
  const conditions = [eq(reports.status, "active"), gt(reports.expiresAt, now)];
  if (categoryId) conditions.push(eq(reports.categoryId, categoryId));

  const [data, countRows] = await Promise.all([
    db.select(PUBLIC_COLS).from(reports).where(and(...conditions)).limit(limit).offset(offset),
    db.select({ value: count() }).from(reports).where(and(...conditions)),
  ]);

  const total = countRows[0]?.value ?? 0;

  return { data, total, limit, offset };
}

export async function findReportById(id: string) {
  const now = new Date();

  const [report] = await db
    .select(PUBLIC_COLS)
    .from(reports)
    .where(and(eq(reports.id, id), gt(reports.expiresAt, now)))
    .limit(1);

  if (!report) return null;

  const images = await db
    .select({
      id: reportImages.id,
      storageKey: reportImages.storageKey,
      isPrimary: reportImages.isPrimary,
    })
    .from(reportImages)
    .where(eq(reportImages.reportId, id));

  return { ...report, images };
}
