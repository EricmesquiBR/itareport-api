import { api } from "@/lib/api";
import { env } from "@/env";

export type ReportStatus = "pending" | "active" | "expired";

export type Report = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  status: ReportStatus;
  credibility: number;
  upvotes: number;
  categoryId: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReportImage = {
  id: string;
  storageKey: string;
  isPrimary: boolean;
};

export type ReportWithImages = Report & { images: ReportImage[] };

export type Pagination = { total: number; page: number; limit: number; offset: number };

export function imageUrl(storageKey: string): string {
  return `${env.STORAGE_URL}/${storageKey}`;
}

export async function createReport(input: {
  title: string;
  categoryId: string;
  lat: number;
  lng: number;
  image: File;
}): Promise<Report> {
  const form = new FormData();
  form.append("title", input.title);
  form.append("categoryId", input.categoryId);
  form.append("lat", String(input.lat));
  form.append("lng", String(input.lng));
  form.append("image", input.image);

  const { data } = await api.post("/reports", form);
  return data.data as Report;
}

export async function getReports(params: {
  page?: number;
  limit?: number;
  categoryId?: string;
} = {}): Promise<{ data: Report[]; pagination: Pagination }> {
  const { data } = await api.get("/reports", { params });
  return { data: data.data as Report[], pagination: data.pagination as Pagination };
}

export async function getReportById(id: string): Promise<ReportWithImages> {
  const { data } = await api.get(`/reports/${id}`);
  return data.data as ReportWithImages;
}

export async function voteOnReport(id: string): Promise<void> {
  await api.post(`/reports/${id}/vote`);
}

export async function getVoteCount(id: string): Promise<{ upvotes: number }> {
  const { data } = await api.get(`/reports/${id}/votes`);
  return data.data as { upvotes: number };
}
