import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  street: z.string().min(1, "Street is required").max(100),
  district: z.string().min(1, "District is required").max(20),
  city: z.string().min(1, "City is required").max(30),
  lat: z.number({ message: "Latitude must be a number" }),
  lng: z.number({ message: "Longitude must be a number" }),
});

export const updateReportSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  street: z.string().min(1).max(100).optional(),
  district: z.string().min(1).max(20).optional(),
  city: z.string().min(1).max(30).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  categoryId: z.string().min(1).optional(),
});
