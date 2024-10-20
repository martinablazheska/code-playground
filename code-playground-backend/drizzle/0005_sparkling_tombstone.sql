ALTER TABLE "rooms" ALTER COLUMN "code_data" SET DEFAULT '{"content":"// Start coding here","lastEditedBy":null,"lastEditedAt":null}'::jsonb;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "programming_language" text DEFAULT 'javascript' NOT NULL;