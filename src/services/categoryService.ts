import { db } from "../db/index.js";
import { categories, reports } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function createCategory(name: any) {
  const [category] = await db.insert(categories).values({ name }).returning();

  return category;
}

export async function findReportByCategory(id: any) {
  const reportsList = await db.query.reports.findMany({
    where: eq(reports.categoryId, id),
  });

  return reportsList;
}

export async function findAllCategory() {
  const categoriesList = await db.query.categories.findMany();
  return categoriesList;
}
