import { api } from "@/lib/api";

export type User = {
  id: string;
  name: string;
  cpf: string;
  email: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export async function createUser(data: {
  name: string;
  cpf: string;
  email: string;
  password: string;
}) {
  const response = await api.post("/users", data);
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post("/users/login", { email, password });
  return response.data.data as LoginResponse;
}

export async function getUserById(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data.data as User;
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string; password?: string },
) {
  const response = await api.put(`/users/${id}`, data);
  return response.data.data as User;
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}
