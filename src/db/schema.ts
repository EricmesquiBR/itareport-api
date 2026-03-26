import { boolean, pgTable, real, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { namedId } from "../utills/named-id.ts";

export const users = pgTable("users", {
  id: varchar("id", { length: 64 })
    .primaryKey()
    .$defaultFn(() => namedId("user")),
  name: varchar("name", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 15 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: varchar("id", { length: 64 })
    .primaryKey()
    .$defaultFn(() => namedId("category")),
  name: varchar("name", { length: 50 }).notNull(),
});

export const reports = pgTable("reports", {
  id: varchar("id", { length: 64 })
    .primaryKey()
    .$defaultFn(() => namedId("report")),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  street: varchar("street", { length: 100 }).notNull(),
  district: varchar("district", { length: 20 }).notNull(),
  city: varchar("city", { length: 30 }).notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  validated: boolean("validated").default(false).notNull(),
  userId: varchar("user_id", { length: 64 })
    .references(() => users.id)
    .notNull(),
  categoryId: varchar("category_id", { length: 64 })
    .references(() => categories.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [reports.categoryId],
    references: [categories.id],
  }),
}));
