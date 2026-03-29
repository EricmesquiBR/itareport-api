import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  cpf: z.string().min(11, "CPF must have at least 11 characters").max(15),
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must have at least 6 characters").max(255),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  password: z.string().min(6).max(255).optional(),
});
