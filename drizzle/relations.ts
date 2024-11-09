import { relations } from "drizzle-orm/relations";
import { problems, examples, problemTags, problemToTags, users, sessions, testCases } from "./schema";

export const examplesRelations = relations(examples, ({one}) => ({
	problem: one(problems, {
		fields: [examples.problemId],
		references: [problems.id]
	}),
}));

export const problemsRelations = relations(problems, ({many}) => ({
	examples: many(examples),
	problemToTags: many(problemToTags),
	testCases: many(testCases),
}));

export const problemToTagsRelations = relations(problemToTags, ({one}) => ({
	problemTag: one(problemTags, {
		fields: [problemToTags.tagId],
		references: [problemTags.id]
	}),
	problem: one(problems, {
		fields: [problemToTags.problemId],
		references: [problems.id]
	}),
}));

export const problemTagsRelations = relations(problemTags, ({many}) => ({
	problemToTags: many(problemToTags),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(sessions),
}));

export const testCasesRelations = relations(testCases, ({one}) => ({
	problem: one(problems, {
		fields: [testCases.problemId],
		references: [problems.id]
	}),
}));