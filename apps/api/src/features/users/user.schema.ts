import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.string().email().max(255).optional(),
});
