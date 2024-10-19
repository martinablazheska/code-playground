ALTER TABLE "rooms" ALTER COLUMN "code_data" SET DEFAULT '{"content":"// Start coding here","lastEditedBy":null,"lastEditedAt":null,"programmingLanguage":"JavaScript"}'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");