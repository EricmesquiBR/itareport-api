import { api } from "@/lib/api";

export type Stats = {
  totalReports: number;
  activeReports: number;
  pendingReports: number;
  expiredReports: number;
  totalUsers: number;
  totalVotes: number;
};

export async function getStats(): Promise<Stats> {
  const { data } = await api.get("/stats");
  return data.data as Stats;
}
