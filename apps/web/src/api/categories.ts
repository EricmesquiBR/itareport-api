import { api } from "@/lib/api";

export type Category = {
  id: string;
  name: string;
};

export type Report = {
  id: string;
  title: string;
  content: string;
  street: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  validated: boolean;
  userId: string;
  categoryId: string;
};

let cachedCategories: Category[] | null = null;
let categoriesPromise: Promise<Category[]> | null = null;

export async function createCategory(name: string) {
  const response = await api.post("/categories", { name });
  cachedCategories = null;
  categoriesPromise = null;
  return response.data.data as Category;
}

export async function getCategories() {
  if (cachedCategories) return cachedCategories;
  if (!categoriesPromise) {
    categoriesPromise = api.get("/categories").then(
      (response) => {
        cachedCategories = response.data.data as Category[];
        return cachedCategories;
      },
      () => {
        categoriesPromise = null;
        throw new Error("Failed to fetch categories");
      },
    );
  }
  return categoriesPromise;
}

export async function getReportsByCategory(id: string) {
  const response = await api.get(`/categories/${id}/reports`);
  return response.data.data as Report[];
}
