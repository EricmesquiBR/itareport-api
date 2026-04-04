import { api } from "@/lib/api";

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

export type PaginationResult<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};

export async function createReport(data: {
  title: string;
  content: string;
  categoryId: string;
  street: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
}) {
  const response = await api.post("/reports", data);
  return response.data;
}

export async function getReports(limit = 50, offset = 0) {
  const response = await api.get("/reports", { params: { limit, offset } });
  return response.data.data as PaginationResult<Report>;
}

export async function getReportById(id: string) {
  const response = await api.get(`/reports/${id}`);
  return response.data.data as Report;
}

export async function updateReport(
  id: string,
  data: {
    title?: string;
    content?: string;
    street?: string;
    district?: string;
    city?: string;
    lat?: number;
    lng?: number;
    catId?: string;
  },
) {
  const response = await api.put(`/reports/${id}`, data);
  return response.data.data as Report;
}

export async function deleteReport(id: string) {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
}
