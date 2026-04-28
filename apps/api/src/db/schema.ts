import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { namedId } from "../utils/named-id.js";
import { timestamps } from "./columns.helpers.js";
import { generateUsername } from "../utils/username.js";

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "active",
  "expired",
]);

export const voteTypeEnum = pgEnum("vote_type", ["up"]);

export const users = pgTable("users", {
  id: varchar("id", { length: 64 })
    .primaryKey()
    .$defaultFn(() => namedId("usr")),
  username: varchar("username", { length: 30 })
    .unique()
    .notNull()
    .$defaultFn(() => generateUsername()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: varchar("image", { length: 512 }),
  deletedAt: timestamp("deleted_at"),
  ...timestamps,
});

// better-auth tables
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: varchar("scope", { length: 512 }),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verifications = pgTable("verifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: varchar("id", { length: 64 })
    .primaryKey()
    .$defaultFn(() => namedId("cat")),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).unique().notNull(),
  ...timestamps,
});

export const reports = pgTable(
  "reports",
  {
    id: varchar("id", { length: 64 })
      .primaryKey()
      .$defaultFn(() => namedId("rep")),
    title: varchar("title", { length: 255 }).notNull(),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
    status: reportStatusEnum("status").default("pending").notNull(),
    credibility: integer("credibility").default(0).notNull(),
    photoCount: integer("photo_count").default(0).notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    uniqueUpvoters: integer("unique_upvoters").default(0).notNull(),
    expiresAt: timestamp("expires_at"),
    userId: varchar("user_id", { length: 64 })
      .references(() => users.id, { onDelete: "set null" }),
    categoryId: varchar("category_id", { length: 64 })
      .references(() => categories.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [
    index("idx_reports_user_id").on(table.userId),
    index("idx_reports_category_id").on(table.categoryId),
    index("idx_reports_status").on(table.status),
  ],
);

export const reportImages = pgTable("report_images", {
  id: varchar("id", { length: 64 })
    .primaryKey()
    .$defaultFn(() => namedId("img")),
  reportId: varchar("report_id", { length: 64 })
    .references(() => reports.id, { onDelete: "cascade" })
    .notNull(),
  storageKey: varchar("storage_key", { length: 512 }).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  ...timestamps,
});

export const reportVotes = pgTable(
  "report_votes",
  {
    id: varchar("id", { length: 64 })
      .primaryKey()
      .$defaultFn(() => namedId("vot")),
    reportId: varchar("report_id", { length: 64 })
      .references(() => reports.id, { onDelete: "cascade" })
      .notNull(),
    userId: varchar("user_id", { length: 64 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    voteType: voteTypeEnum("vote_type").default("up").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_report_votes_report_user").on(table.reportId, table.userId),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
  votes: many(reportVotes),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  user: one(users, { fields: [reports.userId], references: [users.id] }),
  category: one(categories, {
    fields: [reports.categoryId],
    references: [categories.id],
  }),
  images: many(reportImages),
  votes: many(reportVotes),
}));

export const reportImagesRelations = relations(reportImages, ({ one }) => ({
  report: one(reports, {
    fields: [reportImages.reportId],
    references: [reports.id],
  }),
}));

export const reportVotesRelations = relations(reportVotes, ({ one }) => ({
  report: one(reports, {
    fields: [reportVotes.reportId],
    references: [reports.id],
  }),
  user: one(users, { fields: [reportVotes.userId], references: [users.id] }),
}));
