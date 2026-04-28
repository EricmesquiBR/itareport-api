import { api } from "@/lib/api";

export type Me = {
  id: string;
  username: string;
  createdAt: string;
};

export async function getMe(): Promise<Me> {
  const { data } = await api.get("/users/me");
  return data.data as Me;
}

export async function deleteMe(): Promise<void> {
  await api.delete("/users/me");
}
