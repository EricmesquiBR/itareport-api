import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { categories, reports } from "../../db/schema.js";

export async function createCategory(name: string, slug: string) {
  const [category] = await db.insert(categories).values({ name, slug }).returning();
  return category;
}

export async function findReportsByCategory(categoryId: string) {
  const reportsList = await db.select().from(reports).where(eq(reports.categoryId, categoryId));
  return reportsList;
}

export async function findAllCategories() {
  const categoriesList = await db.select().from(categories);
  return categoriesList;
}
