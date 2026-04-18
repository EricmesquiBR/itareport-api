import { api } from "@/lib/api";
import type { Report } from "./reports";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

let cachedCategories: Category[] | null = null;
let categoriesPromise: Promise<Category[]> | null = null;

export async function getCategories(): Promise<Category[]> {
  if (cachedCategories) return cachedCategories;
  if (!categoriesPromise) {
    categoriesPromise = api.get("/categories").then(
      (response) => {
        cachedCategories = response.data.data as Category[];
        return cachedCategories;
      },
      (err) => {
        categoriesPromise = null;
        throw err;
      },
    );
  }
  return categoriesPromise;
}

export async function getReportsByCategory(id: string): Promise<Report[]> {
  const { data } = await api.get(`/categories/${id}/reports`);
  return data.data as Report[];
}
