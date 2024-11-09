import { sqliteTable, foreignKey, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const examples = sqliteTable("examples", {
	id: text("id").primaryKey().notNull(),
	problemId: text("problem_id").notNull().references(() => problems.id),
	inputText: text("input_text").notNull(),
	outputText: text("output_text").notNull(),
	explanation: text("explanation"),
});

export const problemTags = sqliteTable("problem_tags", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
});

export const problemToTags = sqliteTable("problem_to_tags", {
	problemId: text("problem_id").notNull().references(() => problems.id),
	tagId: text("tag_id").notNull().references(() => problemTags.id),
});

export const problems = sqliteTable("problems", {
	id: text("id").primaryKey().notNull(),
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
	isPremium: integer("is_premium").default(false).notNull(),
	createdAt: integer("created_at"),
	updatedAt: integer("updated_at"),
});

export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").references(() => users.id),
	accessToken: text("access_token").notNull(),
	refreshToken: text("refresh_token"),
	accessTokenExpiresAt: integer("access_token_expires_at").notNull(),
	refreshTokenExpiresAt: integer("refresh_token_expires_at"),
	deviceLabel: text("device_label"),
	expiresAt: integer("expires_at").notNull(),
});

export const testCases = sqliteTable("test_cases", {
	id: text("id").primaryKey().notNull(),
	problemId: text("problem_id").notNull().references(() => problems.id),
	input: text("input").notNull(),
	output: text("output").notNull(),
});

export const users = sqliteTable("users", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	avatar: text("avatar"),
	admin: text("admin").default("N"),
	premium: integer("premium").default(false),
	twoFactorEnabled: integer("two_factor_enabled").default(false),
	twoFactorSecret: text("two_factor_secret"),
	firstLogin: integer("first_login").default(true),
},
(table) => {
	return {
		emailUnique: uniqueIndex("users_email_unique").on(table.email),
	}
});