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

export async function createCategory(name: string) {
  const response = await api.post("/categories", { name });
  return response.data.data as Category;
}

export async function getCategories() {
  const response = await api.get("/categories");
  return response.data.data as Category[];
}

export async function getReportsByCategory(id: string) {
  const response = await api.get(`/categories/${id}/reports`);
  return response.data.data as Report[];
}
