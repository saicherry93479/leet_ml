import { relations, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique().notNull(),
  avatar: text("avatar"),
  admin: text("admin").default("N"),
  premiumUser: integer("premium",{"mode":"boolean"}).default(false),
  twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" }).default(
    false
  ),
  twoFactorSecret: text("two_factor_secret"),
  firstLogin: integer("first_login", { mode: "boolean" }).default(true),
});

export const problemTags = sqliteTable("problem_tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
});

// Main problems table
export const problems = sqliteTable("problems", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  difficulty: text("difficulty").notNull(),
  description: text("description").notNull(),
  inputFormat: text("input_format"),
  outputFormat: text("output_format"),
  constraints: text("constraints"),
  category: text("category"),
  order: integer("order"),
  videoId: text("video_id"),
  starterCode: text("starter_code"),
  isPremium: integer("is_premium", { mode: "boolean" })
    .default(false)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const examples = sqliteTable("examples", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  problemId: text("problem_id")
    .notNull()
    .references(() => problems.id),
  inputText: text("input_text").notNull(),
  outputText: text("output_text").notNull(),
  explanation: text("explanation"),
});


export const examplesRelations = relations(examples, ({ one }) => ({
  problem: one(problems, {
    fields: [examples.problemId],
    references: [problems.id],
  }),
}));

// Test cases table
export const testCases = sqliteTable("test_cases", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  problemId: text("problem_id")
    .notNull()
    .references(() => problems.id),
  input: text("input").notNull(),
  output: text("output").notNull(),
});

// Junction table for problems and tags (many-to-many)
export const problemToTags = sqliteTable("problem_to_tags", {
  problemId: text("problem_id")
    .notNull()
    .references(() => problems.id),
  tagId: text("tag_id")
    .notNull()
    .references(() => problemTags.id),
});
export const testCasesRelations = relations(testCases, ({ one }) => ({
  problem: one(problems, {
    fields: [testCases.problemId],
    references: [problems.id],
  }),
}));

// Modified problem relations to make sure all relationships are properly defined
export const problemRelations = relations(problems, ({ many }) => ({
  examples: many(examples),
  testCases: many(testCases),
  problemToTags: many(problemToTags),
}));

export const tagRelations = relations(problemTags, ({ many }) => ({
  problemToTags: many(problemToTags),
}));

export const problemToTagsRelations = relations(problemToTags, ({ one }) => ({
  problem: one(problems, {
    fields: [problemToTags.problemId],
    references: [problems.id],
  }),
  tag: one(problemTags, {
    fields: [problemToTags.tagId],
    references: [problemTags.id],
  }),
}));

export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }).notNull(),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  deviceLabel: text("device_label"),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export type User = InferSelectModel<typeof users>;

export type Session = InferSelectModel<typeof sessions>;

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
