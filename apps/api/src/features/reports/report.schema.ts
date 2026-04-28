import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  categoryId: z.string().min(1, "Category ID is required"),
  lat: z.number({ message: "Latitude must be a number" }),
  lng: z.number({ message: "Longitude must be a number" }),
});

export const updateReportSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  categoryId: z.string().min(1).optional(),
});
