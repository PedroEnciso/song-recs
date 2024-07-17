CREATE TABLE IF NOT EXISTS "creator_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"spotify_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playlist_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playlist_table" ADD CONSTRAINT "playlist_table_creator_id_creator_table_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creator_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
