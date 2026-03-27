import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
};
