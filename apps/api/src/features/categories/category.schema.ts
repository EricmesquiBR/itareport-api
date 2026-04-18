import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, "slug must be lowercase kebab-case"),
});
