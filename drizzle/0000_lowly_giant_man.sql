-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `examples` (
	`id` text PRIMARY KEY NOT NULL,
	`problem_id` text NOT NULL,
	`input_text` text NOT NULL,
	`output_text` text NOT NULL,
	`explanation` text,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `problem_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `problem_to_tags` (
	`problem_id` text NOT NULL,
	`tag_id` text NOT NULL,
	FOREIGN KEY (`tag_id`) REFERENCES `problem_tags`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `problems` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`difficulty` text NOT NULL,
	`description` text NOT NULL,
	`input_format` text,
	`output_format` text,
	`constraints` text,
	`category` text,
	`order` integer,
	`video_id` text,
	`starter_code` text,
	`is_premium` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`access_token_expires_at` integer NOT NULL,
	`refresh_token_expires_at` integer,
	`device_label` text,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `test_cases` (
	`id` text PRIMARY KEY NOT NULL,
	`problem_id` text NOT NULL,
	`input` text NOT NULL,
	`output` text NOT NULL,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`avatar` text,
	`admin` text DEFAULT 'N',
	`premium` integer DEFAULT false,
	`two_factor_enabled` integer DEFAULT false,
	`two_factor_secret` text,
	`first_login` integer DEFAULT true
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
*/